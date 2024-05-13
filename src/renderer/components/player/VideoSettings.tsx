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
import { useState } from 'react';

interface SettingsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onToggle: (isShowed: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ videoRef, onToggle }) => {
  const [settings, setSettings] = useState<boolean>(false);

  const toggleSettings = () => {
    const show = !settings;

    setSettings(show);
    onToggle(show);
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
    //todo
  };

  const handleDubbedChange = () => {
    //todo
  };

  const handleLanguageChange = () => {
    //todo
  };

  return (
    <div className="settings-content">
      <button className="settings" onClick={toggleSettings}>
        <FontAwesomeIcon className="i" icon={faGear} />
      </button>
      {settings && (
        <div className="settings-options show-options">
          <li className="quality">
            <span>
              <FontAwesomeIcon className="i" icon={faVideo} />
              Quality
            </span>
            <select className="main-select-0">
              <option selected>Soon</option>
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
            <select className="main-select-0">
              <option value="60">60</option>
              <option value="65">65</option>
              <option value="70">70</option>
              <option value="75">75</option>
              <option value="80">80</option>
              <option value="85" selected>
                85 (Default)
              </option>
              <option value="90">90</option>
              <option value="95">95</option>
            </select>
          </li>
          <li className="update-progress">
            <span>
              <FontAwesomeIcon className="i" icon={faSpinner} />
              Update progress
            </span>
            <label className="switch">
              <input type="checkbox" onChange={handleUpdateProgressChange} />
              <span className="slider round"></span>
            </label>
          </li>
          <li className="dub">
            <span>
              <FontAwesomeIcon className="i" icon={faHeadphones} />
              Dub
            </span>
            <label className="switch">
              <input type="checkbox" onChange={handleDubbedChange} />
              <span className="slider round"></span>
            </label>
          </li>
          <li className="language">
            <span>
              <FontAwesomeIcon className="i" icon={faLanguage} />
              Language
            </span>
            <select className="main-select-0" onChange={handleLanguageChange}>
              <option value="US">English</option>
              <option value="IT">Italian</option>
            </select>
          </li>
        </div>
      )}
    </div>
  );
};

export default Settings;
