import 'react-activity/dist/Dots.css';

import { IVideo } from '@consumet/extensions';
import Store from 'electron-store';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

import { getEpisodeUrl as animesaturn } from '../../../modules/providers/animesaturn';
import { getEpisodeUrl as gogoanime } from '../../../modules/providers/gogoanime';
import { getAvailableEpisodes, getParsedAnimeTitles } from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import BottomControls from './BottomControls';
import MidControls from './MidControls';
import TopControls from './TopControls';

const STORE = new Store();
var timer: any;
var pauseInfoTimer: any;

interface VideoPlayerProps {
  url?: string;
  isM3U8?: boolean;
  listAnimeData: ListAnimeData;
  episodesInfo: EpisodeInfo[] | null;
  animeEpisodeNumber: number;
  show: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  isM3U8 = false,
  listAnimeData,
  episodesInfo,
  animeEpisodeNumber,
  show,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // const [title, setTitle] = useState<string>(animeTitle); // may be needed in future features
  const [videoUrl, setVideoUrl] = useState<string>();
  const [videoIsM3U8, setVideoIsM3U8] = useState<boolean>();
  const [episodeNumber, setEpisodeNumber] = useState<number>(0);
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [episodeDescription, setEpisodeDescription] = useState<string>('');

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

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setVideoUrl(url);
    setVideoIsM3U8(isM3U8);
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
    setLoading(false);
    loadSource(url ?? '', isM3U8);

    setShowNextEpisodeButton(canNextEpisode(animeEpisodeNumber));
    setShowPreviousEpisodeButton(canPreviousEpisode(animeEpisodeNumber));
  }, []);

  const loadSource = (url: string, isM3U8: boolean) => {
    if (videoRef.current) {
      if (isM3U8) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(videoRef.current as HTMLVideoElement);
          playVideoAndSetTime();
        } else if (
          videoRef.current.canPlayType('application/vnd.apple.mpegurl')
        ) {
          videoRef.current.src = url;
          playVideoAndSetTime();
        }
      } else {
        videoRef.current.src = url;
        playVideoAndSetTime();
      }
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
      }, 1000);
    }
  };

  const handleTimeUpdate = () => {
    setShowPauseInfo(false);
    setCurrentTime(videoRef.current?.currentTime);
    setDuration(videoRef.current?.duration);
    setBuffered(videoRef.current?.buffered);
  };

  const handleVideoPause = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);
    pauseInfoTimer = setTimeout(() => {
      setShowPauseInfo(true);
    }, 3000);
  };

  const handleMouseMove = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);
    
    pauseInfoTimer = setTimeout(() => {
      if(videoRef.current && videoRef.current.paused) {
        setShowPauseInfo(true);
      }
    }, 3000);

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

  const changeEpisode = async (modificator: number) => {
    setLoading(true);
    const nextEpisodeNumber = episodeNumber + modificator;

    const lang = (await STORE.get('source_flag')) as string;
    const dubbed = (await STORE.get('dubbed')) as boolean;
    const animeTitles = getParsedAnimeTitles(listAnimeData.media);

    switch (lang) {
      case 'US': {
        gogoanime(animeTitles, nextEpisodeNumber, dubbed).then((value) => {
          setData(value);
          setLoading(false);
        });
        break;
      }
      case 'IT': {
        animesaturn(animeTitles, nextEpisodeNumber, dubbed).then((value) => {
          setData(value);
          setLoading(false);
        });
        break;
      }
    }

    const setData = (value: IVideo | null) => {
      setVideoUrl(value?.url);
      setVideoIsM3U8(value?.isM3U8);
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
      loadSource(value?.url ?? '', value?.isM3U8 ?? false);
      setShowNextEpisodeButton(canNextEpisode(nextEpisodeNumber));
      setShowPreviousEpisodeButton(canPreviousEpisode(nextEpisodeNumber));
    };
  };

  const canPreviousEpisode = (episode: number): boolean => {
    return episode !== 1;
  };

  const canNextEpisode = (episode: number): boolean => {
    return episode !== getAvailableEpisodes(listAnimeData.media);
  };

  return (
    show && (
      <div
        className={`container ${showControls ? 'show-controls' : ''} ${
          showPauseInfo ? 'show-pause-info' : ''
        }`}
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
        ></video>
      </div>
    )
  );
};

export default VideoPlayer;
