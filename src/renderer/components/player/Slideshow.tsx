import React, { useEffect, useState } from 'react';
import './styles/Slideshow.css'; // Stili CSS per il componente slideshow
import { ListAnimeData } from '../../../types/anilistAPITypes';
import {
  faPlay,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  capitalizeFirstLetter,
  getParsedSeasonYear,
  getAvailableEpisodes,
  getTitle,
  parseDescription,
} from '../../../modules/utils';
import { Button1, Button2 } from '../Buttons';
import { IVideo } from '@consumet/extensions';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { EPISODES_INFO_URL } from '../../../constants/utils';
import { getUniversalEpisodeUrl } from '../../../modules/providers/api';
import { EpisodeInfo } from '../../../types/types';
import AnimeModal from '../modals/AnimeModal';
import VideoPlayer from './VideoPlayer';

interface SlideProps {
  listAnimeData: ListAnimeData;
  index: number;
}

const Slide: React.FC<SlideProps> = ({ listAnimeData, index }) => {
  const style = getComputedStyle(document.body);

  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeInfo[] | null>(null);

  // wether the modal is shown or not
  const [showModal, setShowModal] = useState<boolean>(false);
  // wether the modal has been opened at least once (used to fetch episodes info only once when opening it)
  const [hasModalBeenShowed, setHasModalBeenShowed] = useState<boolean>(false);

  const fetchEpisodesInfo = async () => {
    axios.get(`${EPISODES_INFO_URL}${listAnimeData.media.id}`).then((data) => {
      if (data.data && data.data.episodes) setEpisodesInfo(data.data.episodes);
    });
  };

  const handlePressButton = async () => {
    setShowPlayer(true);
    setLoading(true);

    await fetchEpisodesInfo();
    getUniversalEpisodeUrl(listAnimeData, 1).then((data) => {
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
      setLoading(false);
    });
  };

  const handleChangeLoading = (value: boolean) => {
    setLoading(value);
  };

  return (
    <>
      {showPlayer && (
        <VideoPlayer
          video={playerIVideo}
          listAnimeData={listAnimeData}
          episodesInfo={episodesInfo}
          animeEpisodeNumber={1}
          show={showPlayer}
          loading={loading}
          onChangeLoading={handleChangeLoading}
          onClose={() => {
            setShowPlayer(false);
          }}
        />
      )}
      {listAnimeData && hasModalBeenShowed && (
        <AnimeModal
          listAnimeData={listAnimeData}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="slide">
        <div className="shadow">
          <div className="content show">
            <div className="anime-info">
              <div className="anime-format">{listAnimeData.media.format}</div>•
              <div className="anime-year">
                {capitalizeFirstLetter(listAnimeData.media.season ?? '?')}{' '}
                {getParsedSeasonYear(listAnimeData.media)}
              </div>
              •
              <div className="anime-episodes">
                {getAvailableEpisodes(listAnimeData.media)} Episodes
              </div>
            </div>
            <div className="anime-title">{getTitle(listAnimeData.media)}</div>
            <div className="anime-description">
              {parseDescription(listAnimeData.media.description ?? '')}
            </div>
            <div className="buttons">
              <Button1
                text="Watch now"
                icon={faPlay}
                onPress={handlePressButton}
              />
              <Button2
                text="More info"
                icon={faArrowUpRightFromSquare}
                onPress={() => {
                  setShowModal(true);
                  if (!hasModalBeenShowed) setHasModalBeenShowed(true);
                }}
              />
            </div>
          </div>
        </div>
        <img
          key={index}
          src={listAnimeData.media.bannerImage}
          alt={`Slide ${index}`}
        />
      </div>
      <Toaster />
    </>
  );
};

interface SlideshowProps {
  listAnimeData?: ListAnimeData[];
}

const Slideshow: React.FC<SlideshowProps> = ({ listAnimeData }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [animeData, setAnimeData] = useState<ListAnimeData[] | undefined>();

  useEffect(() => {
    setAnimeData(
      listAnimeData
        ?.filter((animeData) => animeData?.media.bannerImage)
        .slice(0, 5),
    );
  }, [listAnimeData]);

  const goToPrevious = () => {
    if (!animeData) return;
    const newIndex =
      currentIndex === 0 ? animeData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (!animeData) return;
    const newIndex =
      currentIndex === animeData.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slideshow-container">
      <div
        className="slideshow-wrapper"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {animeData &&
          animeData.map((listAnimeData, index) => (
            <Slide key={index} listAnimeData={listAnimeData} index={index} />
          ))}
      </div>
      <div className="dot-container">
        {animeData &&
          animeData.map((_, index) => (
            <span
              key={index}
              className={index === currentIndex ? 'dot active' : 'dot'}
              onClick={() => goToIndex(index)}
            ></span>
          ))}
      </div>
    </div>
  );
};

export default Slideshow;
