import { IVideo } from '@consumet/extensions';
import {
  faArrowLeftLong,
  faArrowRightLong,
  faArrowUpRightFromSquare,
  faInfo,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';

import { getUniversalEpisodeUrl } from '../../modules/providers/api';
import {
  capitalizeFirstLetter,
  getParsedSeasonYear,
  getTitle,
  parseDescription,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import { Button1, Button2, ButtonLoading, CircleButton1 } from './Buttons';
import VideoPlayer from './player/VideoPlayer';
import { EpisodeInfo } from '../../types/types';
import { EPISODES_INFO_URL } from '../../constants/utils';
import axios from 'axios';
import AnimeModal from './modals/AnimeModal';

interface FeaturedItemProps {
  listAnimeData: ListAnimeData;
}

const FeaturedItem: React.FC<FeaturedItemProps> = ({ listAnimeData }) => {
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
      <div className="featured">
        <div className="featured-container">
          <div className="content show">
            <div className="anime-info">
              <div className="anime-format">{listAnimeData.media.format}</div>•
              <div className="anime-year">
                {capitalizeFirstLetter(listAnimeData.media.season ?? '?')}{' '}
                {getParsedSeasonYear(listAnimeData.media)}
              </div>
              •
              <div className="anime-episodes">
                {listAnimeData.media.episodes} Episodes
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
        <div className="featured-img">
          <img src={listAnimeData.media.bannerImage} alt="anime banner" />
        </div>
      </div>
      <Toaster />
    </>
  );
};

interface FeaturedContentProps {
  animeData?: ListAnimeData[];
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ animeData }) => {
  const [showButtons, setShowButtons] = useState(false);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  const onLeftPress = () => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft -= 1000;
    }
  };

  const onRightPress = () => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft += 1000;
    }
  };

  return animeData ? (
    <>
      <div
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <CircleButton1
          icon={faArrowLeftLong}
          classes={`left ${showButtons ? 'show-opacity' : 'hide-opacity'}`}
          onPress={onLeftPress}
        />
        <CircleButton1
          icon={faArrowRightLong}
          classes={`right ${showButtons ? 'show-opacity' : 'hide-opacity'}`}
          onPress={onRightPress}
        />
      </div>
      <h1>Popular Now</h1>
      <div
        className="featured-scroller"
        ref={scrollWrapperRef}
        onMouseEnter={() => setShowButtons(true)}
        onMouseLeave={() => setShowButtons(false)}
      >
        <div
          className="featured-scroller-wrapper"
          style={{
            width: `${
              // trendingAnime?.media?.length! * 100
              (animeData?.filter(
                (listAnimeData) => listAnimeData?.media.bannerImage,
              )?.length ?? 0) * 100
            }%`,
          }}
        >
          {animeData
            ?.filter((animeData) => animeData.media.bannerImage)
            .map((animeData, index) => (
              <FeaturedItem key={index} listAnimeData={animeData} />
            ))}
        </div>
      </div>
    </>
  ) : (
    <Skeleton className="featured skeleton" />
  );
};

export default FeaturedContent;
