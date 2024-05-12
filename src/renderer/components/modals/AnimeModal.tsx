import {
  faCircleExclamation,
  faStar,
  faTv,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'electron-store';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { getEpisodeUrl as animesaturn } from '../../../modules/providers/animesaturn';
import { getEpisodeUrl as gogoanime } from '../../../modules/providers/gogoanime';
import {
  capitalizeFirstLetter,
  getParsedAnimeTitles,
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
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
import VideoPlayer from '../player/VideoPlayer';
import { IVideo } from '@consumet/extensions';
import axios from 'axios';
import { EpisodeInfo } from '../../../types/types';

const EPISODES_INFO_URL = 'https://api.ani.zip/mappings?anilist_id=';
const modalsRoot = document.getElementById('modals-root');
const STORE = new Store();

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
  const [trailer, setTrailer] = useState<string | undefined>(undefined);

  // episodes info
  const [episodesInfoHasFetched, setEpisodesInfoHasFetched] =
    useState<boolean>(false);
  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo[] | null>(null);

  // player
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [animeEpisodeNumber, setAnimeEpisodeNumber] = useState<number>(0);
  const [animeEpisodeTitle, setAnimeEpisodeTitle] = useState<string>('');
  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);

  // close modal by clicking shadow area
  const handleClickOutside = (event: any) => {
    if (!modalRef.current?.contains(event.target as Node)) {
      onClose();
    }
  };

  // close modal by pressing ESC
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const fetchEpisodesInfo = async () => {
    axios.get(`${EPISODES_INFO_URL}${listAnimeData.media.id}`).then((data) => {
      if (data.data && data.data.episodes) setEpisodeInfo(data.data.episodes);
      setEpisodesInfoHasFetched(true);
    });
  };

  useEffect(() => {
    if (!episodesInfoHasFetched) fetchEpisodesInfo();
  }, []);

  const doesTrailerExists = () => {
    if (listAnimeData.media.trailer?.site === 'youtube') {
      setTrailer(listAnimeData.media.trailer.id);
    }
  };

  const playEpisode = async (episode: number) => {
    const lang = (await STORE.get('source_flag')) as string;
    const dubbed = (await STORE.get('dubbed')) as boolean;
    const animeTitles = getParsedAnimeTitles(listAnimeData.media);

    setAnimeEpisodeNumber(episode);
    setAnimeEpisodeTitle('episodeTitle');

    setShowPlayer(true);

    switch (lang) {
      case 'US': {
        gogoanime(animeTitles, episode, dubbed).then((value) => {
          setPlayerIVideo(value);
        });
        break;
      }
      case 'IT': {
        animesaturn(animeTitles, episode, dubbed).then((value) => {
          setPlayerIVideo(value);
        });
        break;
      }
    }
  };

  useEffect(() => {
    // doesTrailerExists();
  }, []);

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show]);

  return ReactDOM.createPortal(
    <>
      {/* <VideoPlayer
        url={playerIVideo?.url}
        isM3U8={playerIVideo?.isM3U8}
        animeTitle={listAnimeData.media.title?.english ?? ''}
        animeEpisodeNumber={animeEpisodeNumber}
        animeEpisodeTitle={animeEpisodeTitle}
        show={showPlayer}
      /> */}
      <ModalPageShadow show={show} />
      <ModalPage show={show}>
        <div className="anime-page" onClick={handleClickOutside}>
          <div className="content-wrapper" ref={modalRef}>
            <button className="exit" onClick={onClose}>
              <FontAwesomeIcon className="i" icon={faXmark} />
            </button>

            {trailer ? (
              <div className="trailer-wrapper">
                <iframe
                  className="trailer"
                  title="Anime trailer"
                  sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                  src={`https://youtube.com/embed/${trailer}?autoplay=1&loop=0&controls=0&color=white&modestbranding=0&rel=0&playsinline=1&enablejsapi=1&playlist=${trailer}`}
                  frameBorder={0}
                ></iframe>
              </div>
            ) : (
              <div className="banner-wrapper">
                {listAnimeData.media.bannerImage && (
                  <img
                    src={listAnimeData.media.bannerImage}
                    className="banner"
                  />
                )}
                <AnimeModalWatchButtons
                  listAnimeData={listAnimeData}
                  onPlay={playEpisode}
                />
              </div>
            )}

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
              episodesInfo={episodeInfo}
              episodesInfoHasFetched={episodesInfoHasFetched}
              listAnimeData={listAnimeData}
              onPlay={playEpisode}
            />
          </div>
        </div>
      </ModalPage>
    </>,
    modalsRoot!,
  );
};

export default AnimeModal;
