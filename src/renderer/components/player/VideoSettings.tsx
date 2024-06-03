import { faClock } from '@fortawesome/free-regular-svg-icons';
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
import 'react-activity/dist/Dots.css';
import { AuthContext } from '../../App';
import { Dots } from 'react-activity';

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
  const [volume, setVolume] = useState(1);

  // loading
  const [changeEpisodeLoading, setChangeEpisodeLoading] =
    useState<boolean>(false);

  useEffect(() => {
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

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Math.min(Math.max(parseFloat(event.target.value), 0), 1);
    console.log(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleUpdateProgressChange = () => {
    STORE.set('update_progress', !updateProgress);
    setUpdateProgress(!updateProgress);
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

  const handleLanguageChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const previous = STORE.get('source_flag');
    STORE.set('source_flag', event.target.value);

    setChangeEpisodeLoading(true);

    if (await onChangeEpisode(null, true)) {
      setSelectedLanguage(event.target.value);
      setChangeEpisodeLoading(false);
    } else {
      STORE.set('source_flag', previous);
      setChangeEpisodeLoading(false);
    }
  };

  const handleSkipTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    STORE.set('intro_skip_time', parseInt(event.target.value));
    setSkipTime(parseInt(event.target.value));
  };

  return (
    <div className="settings-content">
      <button
        className={`b-player ${show ? 'active' : ''}`}
        onClick={toggleShow}
      >
        <FontAwesomeIcon className="i" icon={faGear} />
      </button>
      {show && (
        <div className="dropdown">
          <li className="quality">
            <span>
              <FontAwesomeIcon className="i" icon={faVideo} />
              Quality
            </span>
            <select
              className="main-select-0"
              onChange={handleQualityChange}
              value={hlsData?.currentLevel}
            >
              {hlsData &&
                hlsData?.levels?.map((level, index) => (
                  <option key={index} value={index}>
                    {`${level.height}p`}
                  </option>
                ))}
            </select>
          </li>
          <li className="volume">
            <span onClick={toggleMute}>
              {isMuted ? (
                <FontAwesomeIcon className="i" icon={faVolumeXmark} />
              ) : volume <= 0.3 ? (
                <FontAwesomeIcon className="i" icon={faVolumeLow} />
              ) : (
                <FontAwesomeIcon className="i" icon={faVolumeHigh} />
              )}
              Volume
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={1}
              value={volume}
              onChange={handleVolumeChange}
            />
          </li>
          <li className="playback">
            <span>
              <FontAwesomeIcon className="i" icon={faClock} />
              Speed
            </span>
            <select className="main-select-0" onChange={handleSpeedChange}>
              <option value="0.25">0.25</option>
              <option value="0.50">0.50</option>
              <option value="0.75">0.75</option>
              <option value="1" selected>
                Normal
              </option>
              <option value="1.25">1.25</option>
              <option value="1.50">1.50</option>
              <option value="1.75">1.75</option>
              <option value="2">2</option>
            </select>
          </li>
          <li className="intro-skip-time">
            <span>
              <FontAwesomeIcon className="i" icon={faRotateRight} />
              Intro Skip Time
            </span>
            <select
              className="main-select-0"
              value={skipTime}
              onChange={handleSkipTimeChange}
            >
              <option value="60">60</option>
              <option value="65">65</option>
              <option value="70">70</option>
              <option value="75">75</option>
              <option value="80">80</option>
              <option value="85">85</option>
              <option value="90">90</option>
              <option value="95">95</option>
            </select>
          </li>
          {logged && (
            <li className="update-progress">
              <span>
                <FontAwesomeIcon className="i" icon={faSpinner} />
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
          <li className="dub">
            <span>
              <FontAwesomeIcon className="i" icon={faHeadphones} />
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
              <FontAwesomeIcon className="i" icon={faLanguage} />
              Language
            </span>
            {changeEpisodeLoading ? (
              <div className="activity-indicator">
                <Dots />
              </div>
            ) : (
              <select
                className="main-select-0"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="US">English</option>
                <option value="IT">Italian</option>
              </select>
            )}
          </li>
        </div>
      )}
    </div>
  );
};

export default VideoSettings;
