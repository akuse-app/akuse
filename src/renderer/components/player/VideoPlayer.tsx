import 'react-activity/dist/Dots.css';

import { IVideo } from '@consumet/extensions';
import Store from 'electron-store';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

import { getEpisodeUrl as animesaturn } from '../../../modules/providers/animesaturn';
import { getEpisodeUrl as gogoanime } from '../../../modules/providers/gogoanime';
import {
  formatTime,
  getAvailableEpisodes,
  getParsedAnimeTitles,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import BottomControls from './BottomControls';
import MidControls from './MidControls';
import TopControls from './TopControls';

const STORE = new Store();
var timer: any;
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

  // const [title, setTitle] = useState<string>(animeTitle); // may be needed in future features
  const [videoUrl, setVideoUrl] = useState<string>();
  const [videoIsM3U8, setVideoIsM3U8] = useState<boolean>();
  const [episodeNumber, setEpisodeNumber] = useState<number>(0);
  const [episodeTitle, setEpisodeTitle] = useState<string>('');
  const [episodeDescription, setEpisodeDescription] = useState<string>('');

  // controls
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isSettingsShowed, setIsSettingsShowed] = useState<boolean>(false);
  const [showNextEpisodeButton, setShowNextEpisodeButton] =
    useState<boolean>(true);
  const [showPreviousEpisodeButton, setShowPreviousEpisodeButton] =
    useState<boolean>(true);

  // timeline
  const [currentTime, setCurrentTime] = useState<string>('00:00');
  const [progressTime, setProgressTime] = useState<string>('00:00');
  const [videoDuration, setVideoDuration] = useState<string>('00:00');
  const [remainingtime, setRemainingTime] = useState<string>('00:00');
  const [progressBarWidth, setProgressBarWidth] = useState<string>('0%');
  const [bufferedBarWidth, setBufferedBarWidth] = useState<string>('0%');

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

  const playVideoAndSetTime = () => {
    if (videoRef.current) {
      setTimeout(() => {
        playVideo();
        setCurrentTime(formatTime(videoRef.current?.currentTime!));
        setVideoDuration(formatTime(videoRef.current?.duration!));
        // setRemainingTime(formatTime(videoRef.current?.duration!));
        setProgressBarWidth('0%');
        setBufferedBarWidth('0%');
      }, 1000);
    }
  };

  const handleTimeUpdate = () => {
    const ctime = videoRef.current?.currentTime!;
    const duration = videoRef.current?.duration!;

    setCurrentTime(formatTime(ctime));
    setRemainingTime(formatTime(duration - ctime));
    setProgressBarWidth(`${(ctime / duration) * 100}%`);

    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const endTime = videoRef.current?.buffered.end(0)!;
      setBufferedBarWidth(`${(endTime / duration) * 100}%`);
    }
  };

  const handleMouseMove = () => {
    clearTimeout(timer);
    setShowControls(true);
    setShowCursor(true);

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
        className={`container ${showControls ? 'show-controls' : ''}`}
        onMouseMove={handleMouseMove}
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
        <div className={`shadow-controls ${showCursor ? 'show-cursor' : ''}`}>
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
          />
          <MidControls
            videoRef={videoRef}
            playing={playing}
            playVideo={playVideo}
            pauseVideo={pauseVideo}
            loading={loading}
          />
          <BottomControls
            videoRef={videoRef}
            currentTime={currentTime}
            remainingtime={remainingtime}
            bufferedBarWidth={bufferedBarWidth}
            progressBarWidth={progressBarWidth}
          />
        </div>
        <video
          id="video"
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
        ></video>
      </div>
    )
  );
};

export default VideoPlayer;
