import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faGear,
  faHeadphones,
  faLanguage,
  faRotateRight,
  faSpinner,
  faVideo,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Store from 'electron-store';
import Hls from 'hls.js';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { AuthContext } from '../../App';

const STORE = new Store();

interface SettingsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  hls?: Hls;
  onToggle: (isShowed: boolean) => void;
  onChangeEpisode: (episode: number, reloadAtPreviousTime?: boolean) => void;
}

// component for the video player settings tab
const VideoSettings: React.FC<SettingsProps> = ({
  videoRef,
  hls,
  onToggle,
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
  const [settings, setSettings] = useState<boolean>(false);

  const toggleSettings = () => {
    const show = !settings;

    setSettings(show);
    onToggle(show);
  };

  useEffect(() => {
    setHlsData(hls);
  }, [hls]);

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (hlsData) {
      hlsData.currentLevel = parseInt(event.target.value);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(event.target.value);
    if (videoRef.current) {
      videoRef.current.volume = volume;
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

  const handleWatchDubbedChange = () => {
    STORE.set('dubbed', !watchDubbed);
    setWatchDubbed(!watchDubbed);

    onChangeEpisode(0, true);
  };

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    STORE.set('source_flag', event.target.value);
    setSelectedLanguage(event.target.value);

    onChangeEpisode(0, true);
  };

  const handleSkipTimeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    STORE.set('intro_skip_time', parseInt(event.target.value));
    setSkipTime(parseInt(event.target.value));
  };

  return (
    <div className="settings-content">
      <button className="b-player settings" onClick={toggleSettings}>
        <FontAwesomeIcon className="i" icon={faGear} />
      </button>
      {settings && (
        <div className="dropdown">
          <li className="quality">
            <span>
              <FontAwesomeIcon className="i" icon={faVideo} />
              Quality
            </span>
            <select className="main-select-0" onChange={handleQualityChange} value={hlsData?.currentLevel}>
              {hlsData &&
                hlsData?.levels?.map((level, index) => (
                  <option key={index} value={index}>
                    {`${level.height}p`}
                  </option>
                ))}
            </select>
          </li>
          <li className="volume">
            <span>
              <FontAwesomeIcon className="i" icon={faVolumeHigh} />
              Volume
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="any"
              defaultValue={1}
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
            <label className="switch">
              <input
                type="checkbox"
                checked={watchDubbed}
                onChange={handleWatchDubbedChange}
              />
              <span className="slider round"></span>
            </label>
          </li>
          <li className="language">
            <span>
              <FontAwesomeIcon className="i" icon={faLanguage} />
              Language
            </span>
            <select
              className="main-select-0"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="US">English</option>
              <option value="IT">Italian</option>
            </select>
          </li>
        </div>
      )}
    </div>
  );
};

export default VideoSettings;
