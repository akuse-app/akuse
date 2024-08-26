import 'react-activity/dist/Dots.css';

import { faCirclePlay, faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faGear,
  faHeadphones,
  faLanguage,
  faRotateRight,
  faSpinner,
  faVideo,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'electron-store';
import Hls from 'hls.js';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Dots } from 'react-activity';

import { AuthContext } from '../../App';
import Select from '../Select';

const STORE = new Store();

interface SettingsProps {
  show: boolean;
  onShow: (show: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  hls?: Hls;
  onChangeEpisode: (
    episode: number | null,
    reloadAtPreviousTime?: boolean,
  ) => Promise<boolean>;
}

// component for the video player settings tab
const VideoSettings: React.FC<SettingsProps> = ({
  show,
  onShow,
  videoRef,
  hls,
  onChangeEpisode,
}) => {
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
  const [skipTime, setSkipTime] = useState<number>(
    STORE.get('intro_skip_time') as number,
  );

  const [isMuted, setIsMuted] = useState(false);

  const [volume, setVolume] = useState<number>(
    STORE.get('volume') as number
  );

  const [speed, setSpeed] = useState('1');


  // loading
  const [changeEpisodeLoading, setChangeEpisodeLoading] =
    useState<boolean>(false);

  useEffect(() => {

    // Sets initial volume
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

  const toggleShow = () => {
    onShow(!show);
  };

  useEffect(() => {
    setHlsData(hls);
  }, [hls]);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (hlsData) {
      hlsData.currentLevel = parseInt(event.target.value);
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
      STORE.set('volume', newVolume)
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
    console.log(value)
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

  const handleSkipTimeChange = (value: any) => {
    STORE.set('intro_skip_time', parseInt(value));
    setSkipTime(parseInt(value));
  };

  return (
    <div className="settings-content">
      <button
        className={`b-player ${show ? 'active' : ''}`}
        onClick={toggleShow}
      >
        <div className="tooltip">
          <FontAwesomeIcon className="i" icon={faGear} />
          <div className="tooltip-text">Settings</div>
        </div>
      </button>
      {show && (
        <div className="dropdown">
          <li className="quality">
            <span>
              <FontAwesomeIcon className="i label" icon={faVideo} />
              Quality
            </span>
            {hlsData && (
              <Select
                zIndex={12}
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
              zIndex={11}
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
          <li className="intro-skip-time">
            <span>
              <FontAwesomeIcon className="i label" icon={faRotateRight} />
              Intro Skip Time
            </span>
            <Select
              zIndex={10}
              options={[
                { label: '60', value: 60 },
                { label: '65', value: 65 },
                { label: '70', value: 70 },
                { label: '75', value: 75 },
                { label: '80', value: 80 },
                { label: '85', value: 85 },
                { label: '90', value: 90 },
                { label: '95', value: 95 },
              ]}
              selectedValue={skipTime}
              onChange={handleSkipTimeChange}
              width={100}
            />
          </li>
          {logged && (
            <li className="update-progress">
              <span>
                <FontAwesomeIcon className="i label" icon={faSpinner} />
                Update progress
              </span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={updateProgress}
                  onChange={handleUpdateProgressChange}
                />
                <span className="slider round"></span>
              </label>
            </li>
          )}
          <li className="autoplay-next">
            <span>
              <FontAwesomeIcon className="i label" icon={faCirclePlay} />
              Autoplay Next
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={autoplayNext}
                onChange={handleAutoplayNext}
              />
              <span className="slider round"></span>
            </label>
          </li>
          <li className="dub">
            <span>
              <FontAwesomeIcon className="i label" icon={faHeadphones} />
              Dub
            </span>
            {changeEpisodeLoading ? (
              <div className="activity-indicator">
                <Dots />
              </div>
            ) : (
              <label className="switch">
                <input
                  type="checkbox"
                  checked={watchDubbed}
                  onChange={handleWatchDubbedChange}
                />
                <span className="slider round"></span>
              </label>
            )}
          </li>
          <li className="language">
            <span>
              <FontAwesomeIcon className="i label" icon={faLanguage} />
              Language
            </span>
            {changeEpisodeLoading ? (
              <div className="activity-indicator">
                <Dots />
              </div>
            ) : (
              <Select
                zIndex={9}
                options={[
                  { label: 'English', value: 'US' },
                  { label: 'Italian', value: 'IT' },
                  { label: 'Hungarian', value: 'HU' },
                ]}
                selectedValue={selectedLanguage}
                onChange={handleLanguageChange}
                width={140}
              />
            )}
          </li>
        </div>
      )}
    </div>
  );
};

export default VideoSettings;
