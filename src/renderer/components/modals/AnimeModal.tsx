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

import { getUniversalEpisodeUrl } from '../../../modules/providers/api';
import {
  capitalizeFirstLetter,
  doSomethingToIFrame,
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
  toggleIFrameMute,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
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
import { EPISODES_INFO_URL } from '../../../constants/utils';
import { ButtonCircle } from '../Buttons';

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
  const iFrameRef = useRef<HTMLIFrameElement>(null);

  // trailer
  const [trailer, setTrailer] = useState<string | undefined>(undefined);
  const [trailerVolumeOn, setTrailerVolumeOn] = useState<boolean>(
    STORE.get('trailer_volume_on') as boolean,
  );

  // episodes info
  const [episodesInfoHasFetched, setEpisodesInfoHasFetched] =
    useState<boolean>(false);
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeInfo[] | null>(null);

  // player
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [animeEpisodeNumber, setAnimeEpisodeNumber] = useState<number>(0);
  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // close modal by clicking shadow area
  const handleClickOutside = (event: any) => {
    if (!modalRef.current?.contains(event.target as Node)) {
      closeModal();
    }
  };

  const closeModal = () => {
    if (iFrameRef.current) {
      doSomethingToIFrame(iFrameRef.current, 'stopVideo');
    }

    onClose();
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
      setEpisodesInfoHasFetched(true);
    });
  };

  useEffect(() => {
    if (!episodesInfoHasFetched) fetchEpisodesInfo();
  }, []);

  useEffect(() => {
    if (show && iFrameRef.current)
      doSomethingToIFrame(iFrameRef.current, 'playVideo');
  }, [show]);

  useEffect(() => {
    doesTrailerExists();
  }, []);

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [show]);

  const doesTrailerExists = () => {
    if (listAnimeData.media.trailer?.site === 'youtube') {
      setTrailer(listAnimeData.media.trailer.id);
    }
  };

  const handleTrailerVolume = () => {
    const volumeOn = !trailerVolumeOn;

    setTrailerVolumeOn(volumeOn);
    STORE.set('trailer_volume_on', volumeOn);

    if (iFrameRef.current) toggleIFrameMute(iFrameRef.current, volumeOn);
  };

  const playEpisode = async (episode: number) => {
    if (iFrameRef.current) doSomethingToIFrame(iFrameRef.current, 'pauseVideo');
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
            if (iFrameRef.current)
              doSomethingToIFrame(iFrameRef.current, 'playVideo');
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

            {trailer ? (
              <div className="trailer-wrapper">
                <iframe
                  ref={iFrameRef}
                  className="trailer"
                  title="Anime trailer"
                  sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                  src={`https://youtube.com/embed/${trailer}?autoplay=1&loop=1&controls=0&color=white&modestbranding=0&rel=0&playsinline=1&enablejsapi=1&playlist=${trailer}`}
                  frameBorder={0}
                ></iframe>
                <AnimeModalWatchButtons
                  listAnimeData={listAnimeData}
                  onPlay={playEpisode}
                  loading={false} // loading disabled
                />
                <div className="trailer-volume">
                  <ButtonCircle
                    icon={trailerVolumeOn ? faVolumeHigh : faVolumeXmark}
                    tint="light"
                    onPress={handleTrailerVolume}
                  />
                </div>
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
                  loading={false} // loading disabled
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
