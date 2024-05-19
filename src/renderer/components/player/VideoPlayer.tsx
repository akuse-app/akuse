import './styles/videoPlayer.css';
import 'react-activity/dist/Dots.css';

import { IVideo } from '@consumet/extensions';
import Store from 'electron-store';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import { updateAnimeProgress } from '../../../modules/anilist/anilistApi';
import { getUniversalEpisodeUrl } from '../../../modules/providers/api';
import { getAvailableEpisodes } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import BottomControls from './BottomControls';
import MidControls from './MidControls';
import TopControls from './TopControls';

const STORE = new Store();
const style = getComputedStyle(document.body);
const videoPlayerRoot = document.getElementById('video-player-root');
var timer: any;
var pauseInfoTimer: any;

interface VideoPlayerProps {
  video: IVideo | null;
  listAnimeData: ListAnimeData;
  episodesInfo: EpisodeInfo[] | null;
  animeEpisodeNumber: number;
  show: boolean;
  loading: boolean;
  onChangeLoading: (value: boolean) => void;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  listAnimeData,
  episodesInfo,
  animeEpisodeNumber,
  show,
  loading,
  onChangeLoading,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hlsData, setHlsData] = useState<Hls>();

  // const [title, setTitle] = useState<string>(animeTitle); // may be needed in future features
  const [videoData, setVideoData] = useState<IVideo | null>(null);
  const [episodeNumber, setEpisodeNumber] = useState<number>(0);
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [episodeDescription, setEpisodeDescription] = useState<string>('');
  const [progressUpdated, setProgressUpdated] = useState<boolean>(false);

  // controls
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showPauseInfo, setShowPauseInfo] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isSettingsShowed, setIsSettingsShowed] = useState<boolean>(false);
  const [showNextEpisodeButton, setShowNextEpisodeButton] =
    useState<boolean>(true);
  const [showPreviousEpisodeButton, setShowPreviousEpisodeButton] =
    useState<boolean>(true);

  // timeline
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [buffered, setBuffered] = useState<TimeRanges>();

  // const [videoLoading, setLoading] = useState<boolean>(loading);

  useEffect(() => {
    onChangeLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (video !== null) {
      playHlsVideo(video.url);
      // loadSource(video.url, video.isM3U8 ?? false);
      setVideoData(video);
      setEpisodeNumber(animeEpisodeNumber);
      setEpisodeTitle(
        episodesInfo
          ? episodesInfo[animeEpisodeNumber].title?.en ??
              `Episode ${animeEpisodeNumber}`
          : `Episode ${animeEpisodeNumber}`,
      );
      setEpisodeDescription(
        episodesInfo ? episodesInfo[animeEpisodeNumber].summary ?? '' : '',
      );

      setShowNextEpisodeButton(canNextEpisode(animeEpisodeNumber));
      setShowPreviousEpisodeButton(canPreviousEpisode(animeEpisodeNumber));
    }
  }, [video]);

  const playHlsVideo = (url: string) => {
    if (Hls.isSupported() && videoRef.current) {
      var hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          playVideoAndSetTime();
          setHlsData(hls);
        }
      });
    }
  };

  const playVideo = () => {
    if (videoRef.current) {
      setPlaying(true);
      videoRef.current.play();
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      setPlaying(false);
      videoRef.current.pause();
    }
  };

  const togglePlayingWithoutPropagation = (event: any) => {
    if (event.target !== event.currentTarget) return;
    playing ? pauseVideo() : playVideo();
  };

  const togglePlaying = () => {
    playing ? pauseVideo() : playVideo();
  };

  const playVideoAndSetTime = () => {
    if (videoRef.current) {
      setTimeout(() => {
        playVideo();
        setCurrentTime(videoRef.current?.currentTime);
        setDuration(videoRef.current?.duration);
        onChangeLoading(false);
      }, 1000);
    }
  };

  const handleTimeUpdate = () => {
    const cTime = videoRef.current?.currentTime;
    const dTime = videoRef.current?.duration;

    if (cTime && dTime) {
      setShowPauseInfo(false);
      setCurrentTime(cTime);
      setDuration(dTime);
      setBuffered(videoRef.current?.buffered);

      // automatically update progress
      if (
        (cTime * 100) / dTime > 85 &&
        (STORE.get('update_progress') as boolean) &&
        !progressUpdated
      ) {
        updateAnimeProgress(listAnimeData.media.id!, episodeNumber);
        setProgressUpdated(true);
      }
    }
  };

  const handleVideoPause = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);
    pauseInfoTimer = setTimeout(() => {
      !isSettingsShowed && setShowPauseInfo(true);
    }, 7500);
  };

  const handleMouseMove = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);

    pauseInfoTimer = setTimeout(() => {
      if (videoRef.current && videoRef.current.paused) {
        !isSettingsShowed && setShowPauseInfo(true);
      }
    }, 7500);

    clearTimeout(timer);
    setShowControls(true);
    setShowCursor(true);

    setShowPauseInfo(false);

    if (isSettingsShowed) return;

    timer = setTimeout(() => {
      setShowControls(false);
      setShowCursor(false);
    }, 2000);
  };

  const handleExit = () => {
    if (document.fullscreenElement) {
      setFullscreen(false);
      document.exitFullscreen();
    }
    onClose();
  };

  const toggleFullScreenWithoutPropagation = (event: any) => {
    if (event.target !== event.currentTarget) return;
    toggleFullScreen();
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      setFullscreen(false);
      document.exitFullscreen();
    } else {
      if (document.documentElement.requestFullscreen) {
        setFullscreen(true);
        document.documentElement.requestFullscreen();
      }
    }
  };

  const changeEpisode = async (
    modificator: number,
    reloadAtPreviousTime?: boolean,
  ) => {
    onChangeLoading(true);
    const nextEpisodeNumber = episodeNumber + modificator;

    var previousTime = 0;
    if (reloadAtPreviousTime && videoRef.current)
      previousTime = videoRef.current?.currentTime;

    getUniversalEpisodeUrl(listAnimeData, nextEpisodeNumber).then((data) => {
      if (!data) {
        toast(`Source not found.`, {
          style: {
            color: style.getPropertyValue('--font-2'),
            backgroundColor: style.getPropertyValue('--color-3'),
          },
          icon: '❌',
        });

        return;
      }

      setData(data);
    });

    const setData = (value: IVideo) => {
      setVideoData(value);
      setEpisodeNumber(nextEpisodeNumber);
      setEpisodeTitle(
        episodesInfo
          ? episodesInfo[nextEpisodeNumber].title?.en ??
              `Episode ${nextEpisodeNumber}`
          : `Episode ${nextEpisodeNumber}`,
      );
      setEpisodeDescription(
        episodesInfo ? episodesInfo[nextEpisodeNumber].summary ?? '' : '',
      );
      playHlsVideo(value.url);
      // loadSource(value.url, value.isM3U8 ?? false);
      setShowNextEpisodeButton(canNextEpisode(nextEpisodeNumber));
      setShowPreviousEpisodeButton(canPreviousEpisode(nextEpisodeNumber));
      setProgressUpdated(false);
      if (videoRef.current && reloadAtPreviousTime)
        videoRef.current.currentTime = previousTime;

      onChangeLoading(false);
    };
  };

  const canPreviousEpisode = (episode: number): boolean => {
    return episode !== 1;
  };

  const canNextEpisode = (episode: number): boolean => {
    return episode !== getAvailableEpisodes(listAnimeData.media);
  };

  return ReactDOM.createPortal(
    show && (
      <>
        <div
          className={`container ${showControls ? 'show-controls' : ''} ${showPauseInfo ? 'show-pause-info' : ''}`}
          onMouseMove={handleMouseMove}
          ref={containerRef}
        >
          <div className="pause-info">
            <div className="content">
              <h1 className="you-are-watching">You are watching</h1>
              <h1 id="pause-info-anime-title">
                {listAnimeData.media.title?.english}
              </h1>
              <h1 id="pause-info-episode-title">{episodeTitle}</h1>
              <h1 id="pause-info-episode-description">{episodeDescription}</h1>
            </div>
          </div>
          <div
            className={`shadow-controls ${showCursor ? 'show-cursor' : ''}`}
            onClick={togglePlayingWithoutPropagation}
            onDoubleClick={toggleFullScreenWithoutPropagation}
          >
            <TopControls
              videoRef={videoRef}
              hls={hlsData}
              listAnimeData={listAnimeData}
              episodeNumber={episodeNumber}
              episodeTitle={episodeTitle}
              showNextEpisodeButton={showNextEpisodeButton}
              showPreviousEpisodeButton={showPreviousEpisodeButton}
              fullscreen={fullscreen}
              onFullScreentoggle={toggleFullScreen}
              onChangeEpisode={changeEpisode}
              onSettingsToggle={(isShowed) => setIsSettingsShowed(isShowed)}
              onExit={handleExit}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
            <MidControls
              videoRef={videoRef}
              playing={playing}
              playVideo={playVideo}
              pauseVideo={pauseVideo}
              loading={loading}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
            <BottomControls
              videoRef={videoRef}
              containerRef={containerRef}
              currentTime={currentTime}
              duration={duration}
              buffered={buffered}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
          </div>
          <video
            id="video"
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onPause={handleVideoPause}
            crossOrigin="anonymous"
          ></video>
        </div>
        <Toaster />
      </>
    ),
    videoPlayerRoot!,
  );
};

export default VideoPlayer;
