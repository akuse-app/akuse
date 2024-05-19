import { IVideo } from '@consumet/extensions';
import { faCircleExclamation, faStar, faTv, faVolumeHigh, faVolumeXmark, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Store from 'electron-store';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import { EPISODES_INFO_URL } from '../../../constants/utils';
import { getUniversalEpisodeUrl } from '../../../modules/providers/api';
import {
  capitalizeFirstLetter,
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
  getUrlByCoverType,
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

const modalsRoot = document.getElementById('modals-root');
const STORE = new Store();
const style = getComputedStyle(document.body);

interface AnimeModalProps {
  listAnimeData: ListAnimeData;
  show: boolean;
  onClose: () => void;
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
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeInfo[] | null>(null);

  // player
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [animeEpisodeNumber, setAnimeEpisodeNumber] = useState<number>(0);
  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);

  // other
  const [alternativeBanner, setAlternativeBanner] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!episodesInfoHasFetched) fetchEpisodesInfo();
  }, []);

  useEffect(() => {
    if (show && trailerRef.current && canRePlayTrailer)
      trailerRef.current.play();
    setTrailerVolumeOn(STORE.get('trailer_volume_on') as boolean);
  }, [show]);

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show]);

  const closeModal = () => {
    if (trailerRef.current) {
      trailerRef.current.pause();
      setTimeout(() => {
        if (trailerRef.current) trailerRef.current.currentTime = 0;
      }, 400);
    }

    onClose();
  };

  // close modal by clicking shadow area
  const handleClickOutside = (event: any) => {
    if (!modalRef.current?.contains(event.target as Node)) {
      closeModal();
    }
  };

  // close modal by pressing ESC
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const fetchEpisodesInfo = async () => {
    axios.get(`${EPISODES_INFO_URL}${listAnimeData.media.id}`).then((data) => {
      if (data.data && data.data.episodes) setEpisodesInfo(data.data.episodes);
      data.data.images &&
        setAlternativeBanner(
          getUrlByCoverType(data.data.images, 'fanart') ?? undefined,
        );
      setEpisodesInfoHasFetched(true);
    });
  };

  const handleTrailerPlay = () => {
    if (trailerRef.current) {
      trailerRef.current.volume = trailerVolumeOn ? 1 : 0;
    }
  };

  const handleTrailerLoad = () => {
    if (trailerRef.current) trailerRef.current.play();
    setCanRePlayTrailer(true);
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

  const handleChangeLoading = (value: boolean) => {
    setLoading(value);
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
          onChangeLoading={handleChangeLoading}
          onClose={() => {
            if (trailerRef.current) trailerRef.current.play();
            setShowPlayer(false);
          }}
        />
      )}
      <ModalPageShadow show={show} />
      <ModalPage show={show}>
        <div className="anime-page" onClick={handleClickOutside}>
          <div className="content-wrapper" ref={modalRef}>
            <button className="exit" onClick={closeModal}>
              <FontAwesomeIcon className="i" icon={faXmark} />
            </button>

            <div className="up">
              <AnimeModalWatchButtons
                listAnimeData={listAnimeData}
                onPlay={playEpisode}
                loading={false} // loading disabled
              />

              {canRePlayTrailer && (
                <div className="trailer-volume show-trailer">
                  <ButtonCircle
                    icon={trailerVolumeOn ? faVolumeHigh : faVolumeXmark}
                    tint="light"
                    shadow
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
                    src={`https://yewtu.be/latest_version?id=${listAnimeData.media.trailer?.id}`}
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
                    className="banner"
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
                    {listAnimeData.media.meanScore}%
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
          </div>
        </div>
      </ModalPage>
      <Toaster />
    </>,
    modalsRoot!,
  );
};

export default AnimeModal;
