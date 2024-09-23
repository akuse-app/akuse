import './styles/AnimeModal.css';

import { IVideo } from '@consumet/extensions';
import {
  faCircleExclamation,
  faStar,
  faTv,
  faVolumeHigh,
  faVolumeXmark,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Store from 'electron-store';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';
import { IpcRendererEvent } from 'electron';
import { EPISODES_INFO_URL } from '../../../constants/utils';
import { getUniversalEpisodeUrl } from '../../../modules/providers/api';
import {
  capitalizeFirstLetter,
  getParsedFormat,
  getParsedMeanScore,
  getParsedSeasonYear,
  getProgress,
  getTitle,
  getUrlByCoverType,
  relationsToListAnimeData,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import { ButtonCircle } from '../Buttons';
import VideoPlayer from '../player/VideoPlayer';
import {
  AnimeModalDescription,
  AnimeModalEpisodes,
  AnimeModalGenres,
  AnimeModalOtherTitles,
  AnimeModalStatus,
  AnimeModalWatchButtons,
} from './AnimeModalElements';
import EpisodesSection from './EpisodesSection';
import { ModalPage, ModalPageShadow } from './Modal';
import { ipcRenderer } from 'electron';
import { getAnimeHistory, getLastWatchedEpisode, setAnimeHistory } from '../../../modules/history';
import { Media, MediaFormat, MediaTypes } from '../../../types/anilistGraphQLTypes';
import AnimeSection from '../AnimeSection';
import { Dots } from 'react-activity';
import AnimeEntry from '../AnimeEntry';
import { getAnimeInfo } from '../../../modules/anilist/anilistApi';
import AnimeSections from '../AnimeSections';

const modalsRoot = document.getElementById('modals-root');
const STORE = new Store();
const style = getComputedStyle(document.body);

interface AnimeModalProps {
  listAnimeData: ListAnimeData;
  show: boolean;
  onClose: () => void;
}

interface Option {
  label: string;
  value: ListAnimeData[];
}

const AnimeModal: React.FC<AnimeModalProps> = ({
  listAnimeData,
  show,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLVideoElement>(null);

  // trailer
  const [trailer, setTrailer] = useState<boolean>(true);
  const [trailerVolumeOn, setTrailerVolumeOn] = useState<boolean>(false);
  const [canRePlayTrailer, setCanRePlayTrailer] = useState<boolean>(false);

  // episodes info
  const [episodesInfoHasFetched, setEpisodesInfoHasFetched] =
    useState<boolean>(false);
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeInfo[]>();

  // player
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [animeEpisodeNumber, setAnimeEpisodeNumber] = useState<number>(0);
  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);

  // other
  const [localProgress, setLocalProgress] = useState<number>();
  const [alternativeBanner, setAlternativeBanner] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [relatedAnime, setRelatedAnime] = useState<ListAnimeData[]>();
  const [recommendedAnime, setRecommendedAnime] = useState<ListAnimeData[]>();
  const [lastFetchedId, setLastFetchedId] = useState<number>();
  const [animeOptions, setAnimeOptions] = useState<Option[]>();

  const updateListAnimeData = async () => {
    if(!listAnimeData.media?.relations || !listAnimeData.media?.recommendations) {
      if(lastFetchedId === listAnimeData.media.id)
        return;

      setLastFetchedId(listAnimeData.media.id);

      listAnimeData = {
        id: null,
        mediaId: null,
        progress: null,
        media: await getAnimeInfo(listAnimeData.media.id),
      }

      setLocalProgress(getProgress(listAnimeData.media));
    }
  }

  const getRecommendedAnime = () => {
    const nodes = listAnimeData.media.recommendations?.nodes;
    if(!nodes) return;
    setRecommendedAnime(nodes.map((value) => {
      return {
        id: null,
        mediaId: null,
        progress: null,
        media: value.mediaRecommendation,
      }
    }));
  };

  const getRelatedAnime = () => {
    const edges = listAnimeData.media.relations?.edges;
    if(!edges) return;

    const list = edges.filter((value) => value.node.type === MediaTypes.Anime).map((value) => {
      value.node.format = value.node.format?.substring(0, 2) === 'TV' ? value.relationType as MediaFormat : value.node.format;

      return value;
    });

    setRelatedAnime(relationsToListAnimeData(list));
  };

  useEffect(() => {
    if (show) {
      fetchEpisodesInfo();
      (async () => {
        await updateListAnimeData();
        getRelatedAnime();
        getRecommendedAnime();
      })()
    }
  }, [show]);

  useEffect(() => {
    if (!showPlayer) {
      setPlayerIVideo(null);
    }
  }, [showPlayer]);

  useEffect(() => {
    try {
      if (show && trailerRef.current && canRePlayTrailer)
        trailerRef.current.play();
      setTrailerVolumeOn(STORE.get('trailer_volume_on') as boolean);
    } catch (error) {
      console.log(error);
    }
  }, [show]);

  const closeModal = () => {
    if (trailerRef.current) {
      trailerRef.current.pause();
      setTimeout(() => {
        if (trailerRef.current) trailerRef.current.currentTime = 0;
      }, 400);
    }

    ipcRenderer.send('update-section', 'history');

    onClose();
  };

  // close modal by clicking shadow area
  const handleClickOutside = (event: any) => {
    if (!modalRef.current?.contains(event.target as Node)) {
      closeModal();
    }
  };

  const fetchEpisodesInfo = async () => {
    const animeId = listAnimeData.media.id as number;
    setLocalProgress(getProgress(listAnimeData.media));

    if(listAnimeData.media.nextAiringEpisode !== null) {
      const nextAiringEpisode = listAnimeData.media.nextAiringEpisode;
      if(nextAiringEpisode) {
        const currentTime = Date.now() / 1000;
        nextAiringEpisode.timeUntilAiring = nextAiringEpisode.airingAt ? nextAiringEpisode.airingAt - currentTime : nextAiringEpisode.timeUntilAiring;
        if(nextAiringEpisode.timeUntilAiring > 0 || !nextAiringEpisode.timeUntilAiring) {
          /* Not updated history entry. */
          const entry = getAnimeHistory(animeId);
          if (entry) {
            listAnimeData.media = await getAnimeInfo(animeId);
            entry.data = listAnimeData;
            setAnimeHistory(entry);
          }
        }
      }
    }

    axios
      .get(`${EPISODES_INFO_URL}${animeId}`)
      .then((data) => {
        if (data.data && data.data.episodes)
          setEpisodesInfo(data.data.episodes);
        data.data.images &&
          setAlternativeBanner(
            getUrlByCoverType(data.data.images, 'fanart') ?? undefined,
          );
        setEpisodesInfoHasFetched(true);
      })
      .catch(() => {setEpisodesInfoHasFetched(true);});
  };

  const handleTrailerPlay = () => {
    if (trailerRef.current) {
      trailerRef.current.volume = trailerVolumeOn ? 1 : 0;
    }
  };

  const handleTrailerLoad = () => {
    try {
      if (trailerRef.current) trailerRef.current.play();
      setCanRePlayTrailer(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTrailerError = () => {
    setTrailer(false);
  };

  const toggleTrailerVolume = () => {
    const volumeOn = !trailerVolumeOn;

    if (trailerRef.current) {
      trailerRef.current.volume = volumeOn ? 1 : 0;
      setTrailerVolumeOn(volumeOn);
      STORE.set('trailer_volume_on', volumeOn);
    }
  };

  const playEpisode = async (episode: number) => {
    if (trailerRef.current) trailerRef.current.pause();
    setShowPlayer(true);
    setLoading(true);
    setAnimeEpisodeNumber(episode);

    getUniversalEpisodeUrl(listAnimeData, episode).then((data) => {
      if (!data) {
        toast(`Source not found.`, {
          style: {
            color: style.getPropertyValue('--font-2'),
            backgroundColor: style.getPropertyValue('--color-3'),
          },
          icon: '❌',
        });
        setLoading(false);

        return;
      }
      setPlayerIVideo(data);
    });
  };

  const handleLocalProgressChange = (localProgress: number) => {
    setLocalProgress(localProgress);
  };

  const handleChangeLoading = (value: boolean) => {
    setLoading(value);
  };

  const handlePlayerClose = () => {
    try {
      // if (trailerRef.current) trailerRef.current.play();
      setShowPlayer(false);
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <>
      {showPlayer && (
        <VideoPlayer
          video={playerIVideo}
          listAnimeData={listAnimeData}
          episodesInfo={episodesInfo}
          animeEpisodeNumber={animeEpisodeNumber}
          show={showPlayer}
          loading={loading}
          onLocalProgressChange={handleLocalProgressChange}
          onChangeLoading={handleChangeLoading}
          onClose={handlePlayerClose}
        />
      )}
      <ModalPageShadow show={show} />
      <ModalPage show={show} closeModal={closeModal}>
        <div className="anime-page" onClick={handleClickOutside}>
          <div className="content-wrapper" ref={modalRef}>
            <button className="exit" onClick={closeModal}>
              <FontAwesomeIcon className="i" icon={faXmark} />
            </button>

            <div className="up">
              <AnimeModalWatchButtons
                listAnimeData={listAnimeData}
                localProgress={localProgress}
                onPlay={playEpisode}
                loading={false} // loading disabled
              />

              {canRePlayTrailer && (
                <div className="trailer-volume show-trailer">
                  <ButtonCircle
                    icon={trailerVolumeOn ? faVolumeHigh : faVolumeXmark}
                    tint="empty"
                    shadow
                    tooltipText={trailerVolumeOn ? 'Volume off' : 'Volume on'}
                    onClick={toggleTrailerVolume}
                  />
                </div>
              )}

              {trailer && (
                <div
                  className={`trailer-wrapper ${
                    canRePlayTrailer ? 'show-opacity' : ''
                  }`}
                >
                  <video
                    ref={trailerRef}
                    src={`https://inv.tux.pizza/latest_version?id=${listAnimeData.media.trailer?.id}&itag=18`}
                    className="trailer"
                    preload="none"
                    loop
                    playsInline
                    autoPlay
                    onPlay={handleTrailerPlay}
                    onLoadedMetadata={handleTrailerLoad}
                    onError={handleTrailerError}
                  />
                </div>
              )}

              <div className="banner-wrapper">
                {(alternativeBanner || listAnimeData.media.bannerImage) &&
                episodesInfoHasFetched ? (
                  <img
                    src={alternativeBanner || listAnimeData.media.bannerImage}
                    className="banner show-opacity"
                    alt="Banner"
                  />
                ) : null}
              </div>
            </div>

            <div className="content">
              <div className="left">
                <h1 className="title">{getTitle(listAnimeData.media)}</h1>
                <ul className="info">
                  {listAnimeData.media.isAdult && (
                    <li style={{ color: '#ff6b6b' }}>
                      <FontAwesomeIcon
                        className="i"
                        icon={faCircleExclamation}
                        style={{ marginRight: 7 }}
                      />
                      Adults
                    </li>
                  )}
                  <li style={{ color: '#e5a639' }}>
                    <FontAwesomeIcon
                      className="i"
                      icon={faStar}
                      style={{ marginRight: 7 }}
                    />
                    {getParsedMeanScore(listAnimeData.media)}%
                  </li>
                  <AnimeModalStatus status={listAnimeData.media.status} />
                  <li>
                    <FontAwesomeIcon
                      className="i"
                      icon={faTv}
                      style={{ marginRight: 7 }}
                    />
                    {getParsedFormat(listAnimeData.media.format)}
                  </li>
                  <AnimeModalEpisodes listAnimeData={listAnimeData} />
                </ul>
                <AnimeModalDescription listAnimeData={listAnimeData} />
              </div>
              <div className="right">
                <p className="additional-info">
                  {'Released on: '}
                  <span>
                    {capitalizeFirstLetter(listAnimeData.media.season ?? '?')}{' '}
                    {getParsedSeasonYear(listAnimeData.media)}
                  </span>
                </p>
                <AnimeModalGenres genres={listAnimeData.media.genres ?? []} />
                <AnimeModalOtherTitles
                  synonyms={listAnimeData.media.synonyms ?? []}
                />
              </div>
            </div>
            <EpisodesSection
              episodesInfo={episodesInfo}
              episodesInfoHasFetched={episodesInfoHasFetched}
              listAnimeData={listAnimeData}
              loading={loading}
              onPlay={playEpisode}
            />
            {(recommendedAnime || relatedAnime) && <AnimeSections
              id={'recommended'}
              selectedLabel={relatedAnime && 'Related' || 'Recommended'}
              options={[
                {label: 'Related', value: relatedAnime || []},
                {label: 'Recommended', value: recommendedAnime || []},
              ]}
            />}
            {/* {relatedAnime && relatedAnime.length > 0 &&
              <div className='related-anime'>
                <AnimeSection
                  title='Related'
                  animeData={relatedAnime}
                />
              </div>
            }
            {recommendedAnime && recommendedAnime.length > 0 &&
              <div className='recommended-anime'>
                <AnimeSection
                  title='Recommended'
                  animeData={recommendedAnime}
                />
              </div>
            } */}
          </div>
        </div>
      </ModalPage>
      <Toaster />
    </>,
    modalsRoot!,
  );
};

export default AnimeModal;
