import './styles/VideoPlayer.css';
import 'react-activity/dist/Dots.css';

import { IVideo } from '@consumet/extensions';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import {
  updateAnimeFromList,
  updateAnimeProgress,
} from '../../../modules/anilist/anilistApi';
import { getUniversalEpisodeUrl } from '../../../modules/providers/api';
import {
  getAvailableEpisodes,
  getRandomDiscordPhrase,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { EpisodeInfo } from '../../../types/types';
import BottomControls from './BottomControls';
import MidControls from './MidControls';
import TopControls from './TopControls';
import { getAnimeHistory, setAnimeHistory } from '../../../modules/history';
import AniSkip from '../../../modules/aniskip';
import { SkipEvent } from '../../../types/aniskipTypes';
import { skip } from 'node:test';

const STORE = new Store();
const style = getComputedStyle(document.body);
const videoPlayerRoot = document.getElementById('video-player-root');
var timer: any;
var pauseInfoTimer: any;

interface VideoPlayerProps {
  video: IVideo | null;
  listAnimeData: ListAnimeData;
  episodesInfo?: EpisodeInfo[];
  animeEpisodeNumber: number;
  show: boolean;
  loading: boolean;

  // when progress updates from video player,
  // this helps displaying the correct progress value
  onLocalProgressChange: (localprogress: number) => void;
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
  onLocalProgressChange,
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
  const [activity, setActivity] = useState<boolean>(false);

  if (!activity && episodeTitle) {
    setActivity(true);
    ipcRenderer.send('update-presence', {
      details: `Watching ${listAnimeData.media.title?.english}`,
      state: episodeTitle,
      startTimestamp: Date.now(),
      largeImageKey: listAnimeData.media.coverImage?.large || 'akuse',
      largeImageText: listAnimeData.media.title?.english || 'akuse',
      smallImageKey: 'icon',
      buttons: [
        {
          label: 'Download app',
          url: 'https://github.com/akuse-app/akuse/releases/latest',
        },
      ],
    });
  }

  // controls
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showPauseInfo, setShowPauseInfo] = useState<boolean>(false);
  const [showCursor, setShowCursor] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [isSettingsShowed, setIsSettingsShowed] = useState<boolean>(false);
  const [lastInteract, setLastInteract] = useState<number>(0);
  const [showNextEpisodeButton, setShowNextEpisodeButton] =
    useState<boolean>(true);
  const [showPreviousEpisodeButton, setShowPreviousEpisodeButton] =
    useState<boolean>(true);

  // timeline
  const [currentTime, setCurrentTime] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [buffered, setBuffered] = useState<TimeRanges>();
  const [skipEvents, setSkipEvents] = useState<SkipEvent[]>();


  // keydown handlers
  const handleVideoPlayerKeydown = async (
    event: KeyboardEvent | React.KeyboardEvent<HTMLVideoElement>,
  ) => {
    if (event.keyCode === 229 || !videoRef?.current) return;

    const video = videoRef.current;

    switch (event.code) {
      case 'Space': {
        event.preventDefault();
        togglePlaying();
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        video.currentTime -= 5;
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        video.volume = Math.min(video.volume + 0.1, 1);
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        video.currentTime += 5;
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        video.volume = Math.max(video.volume - 0.1, 0);
        break;
      }
      case 'F11': {
        event.preventDefault();
        toggleFullScreen();
        break;
      }
    }
    switch (event.key) {
      case 'f': {
        event.preventDefault();
        toggleFullScreen();
        break;
      }
      case 'm': {
        event.preventDefault();
        toggleMute();
        break;
      }
      case 'p': {
        event.preventDefault();
        canPreviousEpisode(episodeNumber) &&
          (await changeEpisode(episodeNumber - 1));
        break;
      }
      case 'n': {
        event.preventDefault();
        canNextEpisode(episodeNumber) &&
          (await changeEpisode(episodeNumber + 1));
        break;
      }
    }
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLVideoElement>) => {
    if (videoRef.current) {
      handleVideoPlayerKeydown(event);
    }
  };

  useEffect(() => {
    const handleDocumentKeydown = (event: KeyboardEvent) => {
      if (videoRef.current) {
        handleVideoPlayerKeydown(event);
      }
    };

    document.addEventListener('keydown', handleDocumentKeydown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeydown);
    };
  }, [handleVideoPlayerKeydown]);

  useEffect(() => {
    const video = videoRef.current;

    const handleSeeked = () => {
      console.log('seeked');
      onChangeLoading(false);
      handleHistoryUpdate();
      if (!video?.paused) setPlaying(true);
    };

    const handleWaiting = () => {
      console.log('waiting');
      onChangeLoading(true);
      setPlaying(false);
    };

    if (video) {
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('waiting', handleWaiting);

      return () => {
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('waiting', handleWaiting);
      };
    }
  }, []);

  useEffect(() => {
    onChangeLoading(loading);
  }, [loading]);

  const getSkipEvents = async (episode: number) => {
    const episodeLength = videoRef.current?.duration ? videoRef.current?.duration : 0;
    const skipEvent = await AniSkip.getSkipEvents(listAnimeData.media.idMal as number, episode ?? episodeNumber ?? animeEpisodeNumber, episodeLength);

    setSkipEvents(skipEvent);
  }

  useEffect(() => {
    if (video !== null) {
      playHlsVideo(video.url);

      // resume from tracked progress
      const animeId = (listAnimeData.media.id || listAnimeData.media.mediaListEntry && listAnimeData.media.mediaListEntry.id) as number;
      const animeHistory = getAnimeHistory(animeId);

      if(animeHistory !== undefined) {
        const currentEpisode = animeHistory.history[animeEpisodeNumber];
        if(currentEpisode !== undefined && videoRef?.current) {
          videoRef.current.currentTime = currentEpisode.time
        }
      }

      setVideoData(video);
      setEpisodeNumber(animeEpisodeNumber);
      setEpisodeTitle(
        episodesInfo
          ? (episodesInfo[animeEpisodeNumber].title?.en ??
              `Episode ${animeEpisodeNumber}`)
          : `Episode ${animeEpisodeNumber}`,
      );
      setEpisodeDescription(
        episodesInfo ? (episodesInfo[animeEpisodeNumber].summary ?? '') : '',
      );

      setShowNextEpisodeButton(canNextEpisode(animeEpisodeNumber));
      setShowPreviousEpisodeButton(canPreviousEpisode(animeEpisodeNumber));
      getSkipEvents(animeEpisodeNumber)
    }
  }, [video, listAnimeData]);

  const playHlsVideo = (url: string) => {
    try {
      console.log(url);
      if (Hls.isSupported() && videoRef.current) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (videoRef.current) {
            hls.currentLevel = hls.levels.length - 1;
            playVideoAndSetTime();
            setHlsData(hls);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleHistoryUpdate = () => {
    const video = videoRef.current;
    const cTime = video?.currentTime;
    if(cTime === undefined) return;
    const animeId = (listAnimeData.media.id || listAnimeData.media.mediaListEntry && listAnimeData.media.mediaListEntry.id) as number;
    if(animeId === null || animeId === undefined) return;
    let entry = getAnimeHistory(animeId) ?? { history: {}, data: listAnimeData };

    entry.history[episodeNumber] = {
      time: cTime,
      timestamp: Date.now(),
      duration: video?.duration,
      data: (episodesInfo as EpisodeInfo[])[episodeNumber]
    };

    setAnimeHistory(entry);
    onLocalProgressChange(episodeNumber - 1);
  };

  const playVideo = () => {
    if (videoRef.current) {
      try {
        setPlaying(true);
        videoRef.current.play();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      try {
        setPlaying(false);
        videoRef.current.pause();
        handleHistoryUpdate();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const togglePlayingWithoutPropagation = (event: any) => {
    if (event.target !== event.currentTarget) return;
    playing ? pauseVideo() : playVideo();
  };

  const togglePlaying = () => {
    try {
      playing ? pauseVideo() : playVideo();
    } catch (error) {
      console.log(error);
    }
  };

  const playVideoAndSetTime = () => {
    try {
      if (videoRef.current) {
        setTimeout(() => {
          playVideo();
          setCurrentTime(videoRef.current?.currentTime);
          setDuration(videoRef.current?.duration);
          onChangeLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCurrentProgress = (completed: boolean = true) => {
    const status = listAnimeData.media.mediaListEntry?.status;
    if((STORE.get('logged') as boolean)) {
      switch (status) {
        case 'CURRENT': {
          updateAnimeProgress(listAnimeData.media.id!, episodeNumber);
          break;
        }
        case 'REPEATING':
        case 'COMPLETED': {
          updateAnimeFromList(
            listAnimeData.media.id,
            'REWATCHING',
            undefined,
            episodeNumber,
          );
        }
        default: {
          updateAnimeFromList(
            listAnimeData.media.id,
            'CURRENT',
            undefined,
            episodeNumber,
          );
        }
      }
    }

    setProgressUpdated(true);
    onLocalProgressChange(completed ? episodeNumber : episodeNumber - 1);
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current?.paused) {
      setPlaying(true);
      onChangeLoading(false);
    }

    const cTime = videoRef.current?.currentTime;
    const dTime = videoRef.current?.duration;

    try {
      if (cTime && dTime) {
        setShowPauseInfo(false);
        setCurrentTime(cTime);
        setDuration(dTime);
        setBuffered(videoRef.current?.buffered);
        handleHistoryUpdate();

        if (
          (cTime * 100) / dTime > 85 &&
          (STORE.get('update_progress') as boolean) &&
          !progressUpdated
        ) {
          // when updating progress, put the anime in current if it wasn't there
          updateCurrentProgress();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoPause = () => {
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);
    setShowControls(true);
    pauseInfoTimer = setTimeout(() => {
      !isSettingsShowed && setShowPauseInfo(true);
      setShowControls(false);
    }, 7500);
  };

  const handleVideoEnd = () => {
    if ((STORE.get('autoplay_next') as boolean) === true) {
      canNextEpisode(episodeNumber) && changeEpisode(episodeNumber + 1);
    }
  };

  const handleMouseMove = () => {
    const current = Date.now() / 1000;
    if(current - lastInteract < 0.75) return;
    setLastInteract(current);
    clearTimeout(pauseInfoTimer);
    setShowPauseInfo(false);

    pauseInfoTimer = setTimeout(() => {
      try {
        if (videoRef.current && videoRef.current.paused) {
          setShowPauseInfo(true);
        }
      } catch (error) {
        console.log(error);
      }
    }, 7500);

    clearTimeout(timer);
    setShowControls(true);
    setShowCursor(true);

    setShowPauseInfo(false);

    timer = setTimeout(() => {
      setShowControls(false);
      setShowCursor(false);
    }, 2000);
  };

  const handleExit = async () => {
    if (document.fullscreenElement) {
      setFullscreen(false);
      document.exitFullscreen();
    }

    if (
      videoRef.current &&
      videoRef.current === document.pictureInPictureElement
    ) {
      await document.exitPictureInPicture();
    }

    onClose();
    updateCurrentProgress(false);

    ipcRenderer.send('update-presence', {
      details: `🌸 Watch anime without ads.`,
      state: getRandomDiscordPhrase(),
      startTimestamp: Date.now(),
      largeImageKey: 'icon',
      largeImageText: 'akuse',
      smallImageKey: undefined,
      instance: true,
      buttons: [
        {
          label: 'Download app',
          url: 'https://github.com/akuse-app/akuse/releases/latest',
        },
      ],
    });
  };

  const toggleFullScreenWithoutPropagation = (event: any) => {
    if (event.target !== event.currentTarget) return;
    toggleFullScreen();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
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

  const togglePiP = async () => {
    if (videoRef.current) {
      try {
        if (videoRef.current !== document.pictureInPictureElement) {
          await videoRef.current.requestPictureInPicture();
        } else {
          await document.exitPictureInPicture();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeEpisode = async (
    episode: number | null, // null to play the current episode
    reloadAtPreviousTime?: boolean,
  ): Promise<boolean> => {
    onChangeLoading(true);

    const episodeToPlay = episode || episodeNumber;

    var previousTime = 0;
    if (reloadAtPreviousTime && videoRef.current)
      previousTime = videoRef.current?.currentTime;

    const setData = (value: IVideo) => {
      setVideoData(value);
      setEpisodeNumber(episodeToPlay);
      getSkipEvents(episodeToPlay);
      setEpisodeTitle(
        episodesInfo
          ? (episodesInfo[episodeToPlay].title?.en ?? `Episode ${episode}`)
          : `Episode ${episode}`,
      );
      setEpisodeDescription(
        episodesInfo ? (episodesInfo[episodeToPlay].summary ?? '') : '',
      );
      playHlsVideo(value.url);
      // loadSource(value.url, value.isM3U8 ?? false);
      setShowNextEpisodeButton(canNextEpisode(episodeToPlay));
      setShowPreviousEpisodeButton(canPreviousEpisode(episodeToPlay));
      setProgressUpdated(false);

      try {
        if (videoRef.current && reloadAtPreviousTime)
          videoRef.current.currentTime = previousTime;
      } catch (error) {
        console.log(error);
      }

      onChangeLoading(false);
    };

    const data = await getUniversalEpisodeUrl(listAnimeData, episodeToPlay);
    if (!data) {
      toast(`Source not found.`, {
        style: {
          color: style.getPropertyValue('--font-2'),
          backgroundColor: style.getPropertyValue('--color-3'),
        },
        icon: '❌',
      });

      onChangeLoading(false);
      return false;
    }

    setData(data);
    return true;
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
          // onKeyDown={handleKeydown}
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
              episodesInfo={episodesInfo}
              episodeNumber={episodeNumber}
              episodeTitle={episodeTitle}
              showNextEpisodeButton={showNextEpisodeButton}
              showPreviousEpisodeButton={showPreviousEpisodeButton}
              fullscreen={fullscreen}
              onFullScreentoggle={toggleFullScreen}
              onPiPToggle={togglePiP}
              onChangeEpisode={changeEpisode}
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
              skipEvents={skipEvents}
              buffered={buffered}
              onClick={togglePlayingWithoutPropagation}
              onDblClick={toggleFullScreenWithoutPropagation}
            />
          </div>
          <video
            id="video"
            ref={videoRef}
            onKeyDown={handleKeydown}
            onTimeUpdate={handleTimeUpdate}
            onPause={handleVideoPause}
            onEnded={handleVideoEnd}
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
