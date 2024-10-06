import React, { forwardRef, useContext, useEffect, useRef, useState, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faGear,
  faLanguage,
  faRotateRight,
  faVideo,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import Select from '../Select';
import Store from 'electron-store';
import { AuthContext } from '../../App';
import Hls from 'hls.js';
import { ISubtitle } from '@consumet/extensions';

const STORE = new Store();

interface SettingsProps {
  show: boolean;
  onShow: (show: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  subtitleTracks?: ISubtitle[];
  onSubtitleTrack: (
    track: ISubtitle
  ) => void;
  hls?: Hls;
  onChangeEpisode: (
    episode: number | null,
    reloadAtPreviousTime?: boolean,
  ) => Promise<boolean>;
}

const VideoSettings = forwardRef<HTMLDivElement, SettingsProps>(
  ({ show, onShow, videoRef, hls, onChangeEpisode, onSubtitleTrack, subtitleTracks }, ref) => {
    const logged = useContext(AuthContext);

    const [hlsData, setHlsData] = useState<Hls>();
    const [updateProgress, setUpdateProgress] = useState<boolean>(
      STORE.get('update_progress') as boolean,
    );
    const [autoplayNext, setAutoplayNext] = useState<boolean>(
      STORE.get('autoplay_next') as boolean,
    );
    const [watchDubbed, setWatchDubbed] = useState<boolean>(
      STORE.get('dubbed') as boolean,
    );
    const [selectedLanguage, setSelectedLanguage] = useState<string>(
      STORE.get('source_flag') as string,
    );
    const [introSkipTime, setIntroSkipTime] = useState<number>(
      STORE.get('intro_skip_time') as number,
    );
    const [skipTime, setSkipTime] = useState<number>(
      STORE.get('key_press_skip') as number,
    );
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState<number>(STORE.get('volume') as number);
    const [speed, setSpeed] = useState('1');
    const [changeEpisodeLoading, setChangeEpisodeLoading] = useState<boolean>(
      false,
    );
    const [subtitleTrack, setSubtitleTrack] = useState<ISubtitle | undefined>();

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }

      const handleVideoVolumeChange = () => {
        if (videoRef.current) {
          setIsMuted(videoRef.current.muted);
          setVolume(videoRef.current.volume);
        }
      };

      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.addEventListener('volumechange', handleVideoVolumeChange);
      }

      return () => {
        if (videoElement) {
          videoElement.removeEventListener(
            'volumechange',
            handleVideoVolumeChange,
          );
        }
      };
    }, []);

    useEffect(() => {
      if(!subtitleTrack) {
        const lastUsed = STORE.get('subtitle_language') as string;
        setSubtitleTrack(
          (subtitleTracks && subtitleTracks.length > 0) ? (subtitleTracks.find(value =>
            value.lang.substring(0, lastUsed.length) === lastUsed as string) || subtitleTracks[0]) : undefined
        )
      }

      setHlsData(hls);
    }, [hls]);

    const toggleShow = () => {
      onShow(!show);
    };

    const handleQualityChange = (index: number) => {
      if (hlsData) {
        hlsData.currentLevel = index;
      }
    };

    const toggleMute = () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
        if (videoRef.current.muted) {
          setVolume(0);
        } else {
          setVolume(videoRef.current.volume);
        }
      }
    };

    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(event.target.value);
      if (videoRef.current) {
        STORE.set('volume', newVolume);
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
      }
    };

    const handleSpeedChange = (value: any) => {
      const speedValue = parseFloat(value);
      setSpeed(value);
      if (videoRef.current) {
        videoRef.current.playbackRate = speedValue;
      }
    };

    const handleUpdateProgressChange = () => {
      STORE.set('update_progress', !updateProgress);
      setUpdateProgress(!updateProgress);
    };

    const handleAutoplayNext = () => {
      STORE.set('autoplay_next', !autoplayNext);
      setAutoplayNext(!autoplayNext);
    };

    const handleWatchDubbedChange = async () => {
      const previous = STORE.get('dubbed');
      STORE.set('dubbed', !watchDubbed);

      setChangeEpisodeLoading(true);

      if (await onChangeEpisode(null, true)) {
        setWatchDubbed(!watchDubbed);
        setChangeEpisodeLoading(false);
      } else {
        STORE.set('dubbed', previous);
        setChangeEpisodeLoading(false);
      }
    };

    const handleLanguageChange = async (value: any) => {
      console.log(value);
      const previous = STORE.get('source_flag');
      STORE.set('source_flag', value);

      setChangeEpisodeLoading(true);

      if (await onChangeEpisode(null, true)) {
        setSelectedLanguage(value);
        setChangeEpisodeLoading(false);
      } else {
        STORE.set('source_flag', previous);
        setChangeEpisodeLoading(false);
      }
    };

    const handleIntroSkipTimeChange = (value: any) => {
      STORE.set('intro_skip_time', parseInt(value));
      setIntroSkipTime(parseInt(value));
    };

    const handleSkipTimeChange = (value: any) => {
      STORE.set('key_press_skip', parseInt(value));
      setSkipTime(parseInt(value));
    };

    const handleChangeSubtitleTrack = (value: ISubtitle) => {
      STORE.set('subtitle_language', value.lang);
      onSubtitleTrack(value);
      setSubtitleTrack(value);
    };

    return (
      <div className="settings-content">
        <button className={`b-player ${show ? 'active' : ''}`} onClick={toggleShow}>
          <div className="tooltip">
            <FontAwesomeIcon className="i" icon={faGear} />
            <div className="tooltip-text">Settings</div>
          </div>
        </button>
        {show && (
          <div ref={ref} className="dropdown">
            <li className="quality">
              <span>
                <FontAwesomeIcon className="i label" icon={faVideo} />
                Quality
              </span>
              {hlsData && (
                <Select
                  zIndex={13}
                  options={[
                    ...hlsData?.levels?.map((level, index) => ({
                      label: `${level.height}p`,
                      value: index,
                    })),
                  ]}
                  selectedValue={hlsData?.currentLevel}
                  onChange={handleQualityChange}
                  width={110}
                />
              )}
            </li>
            <li className="volume">
              <span onClick={toggleMute}>
                {isMuted ? (
                  <FontAwesomeIcon className="i label" icon={faVolumeXmark} />
                ) : volume <= 0.3 ? (
                  <FontAwesomeIcon className="i label" icon={faVolumeLow} />
                ) : (
                  <FontAwesomeIcon className="i label" icon={faVolumeHigh} />
                )}
                Volume
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
              />
            </li>
            <li className="playback">
              <span>
                <FontAwesomeIcon className="i label" icon={faClock} />
                Speed
              </span>
              <Select
                zIndex={12}
                options={[
                  { label: '0.25', value: '0.25' },
                  { label: '0.50', value: '0.50' },
                  { label: '0.75', value: '0.75' },
                  { label: '1', value: '1' },
                  { label: '1.25', value: '1.25' },
                  { label: '1.50', value: '1.50' },
                  { label: '1.75', value: '1.75' },
                  { label: '2', value: '2' },
                ]}
                selectedValue={speed}
                onChange={handleSpeedChange}
                width={100}
              />
            </li>
            <li className="skip-time">
              <span>
                <FontAwesomeIcon className="i label" icon={faRotateRight} />
                Skip Time
              </span>
              <Select
                zIndex={11}
                options={[
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 },
                  { label: '5', value: 5 },
                ]}
                selectedValue={skipTime}
                onChange={handleSkipTimeChange}
                width={100}
              />
            </li>
            {subtitleTrack && subtitleTracks && <li className="subtitle-tracks">
              <span>
                <FontAwesomeIcon className="i label" icon={faLanguage} />
                Subtitles
              </span>
              <Select
                zIndex={10}
                options={subtitleTracks.filter(value => value.lang && value.lang !== 'Thumbnails').map(value => ({
                  label: value.lang,
                  value: value
                }))}
                selectedValue={subtitleTrack}
                onChange={handleChangeSubtitleTrack}
                width={100}
              />
            </li>}
            <li className="intro-skip-time">
              <span>
                <FontAwesomeIcon className="i label" icon={faRotateRight} />
                Intro Skip Time
              </span>
              <Select
                zIndex={9}
                options={[
                  { label: '5', value: 5 },
                  { label: '10', value: 10 },
                  { label: '15', value: 15 },
                  { label: '20', value: 20 },
                ]}
                selectedValue={introSkipTime}
                onChange={handleIntroSkipTimeChange}
                width={100}
              />
            </li>
          </div>
        )}
      </div>
    );
  },
);

export default VideoSettings;
