import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleLeft,
  faExpand,
  faForward,
  faGear,
  faHeadphones,
  faLanguage,
  faPlay,
  faRotateLeft,
  faRotateRight,
  faSpinner,
  faVideo,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

var HLS = new Hls();

interface VideoPlayerProps {
  url?: string;
  isM3U8?: boolean;
  animeTitle: string;
  animeEpisodeNumber: number;
  animeEpisodeTitle: string;
  show: boolean;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  isM3U8 = false,
  animeTitle,
  animeEpisodeNumber,
  animeEpisodeTitle,
  show,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // const [title, setTitle] = useState<string>(animeTitle); // may be needed in future features
  const [episodeNumber, setEpisodeNumber] = useState<number>();
  const [episodeTitle, setEpisodeTitle] = useState<string>();

  useEffect(() => {
    setEpisodeNumber(animeEpisodeNumber);
    setEpisodeTitle(animeEpisodeTitle);
  });

  useEffect(() => {
    if (show && url) {
      if (isM3U8 && videoRef.current) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(videoRef.current as HTMLVideoElement);
          videoRef.current.play();
        } else if (
          videoRef.current.canPlayType('application/vnd.apple.mpegurl')
        ) {
          videoRef.current.src = url;
          videoRef.current.play();
        }
      } else {
        if (videoRef.current) {
          videoRef.current.src = url;
          videoRef.current.play();
        }
      }
    }
  }, [show, url, isM3U8]);

  return (
    show && (
      <div className="container show-controls">
        <div className="pause-info">
          <div className="content">
            <h1 className="you-are-watching">You are watching</h1>
            <h1 id="pause-info-anime-title"></h1>
            <h1 id="pause-info-episode-title"></h1>
            <h1 id="pause-info-episode-description"></h1>
          </div>
        </div>
        <div className="shadow-controls">
          <div className="up-controls">
            <div className="left">
              <div className="info exit-video" onClick={onClose}>
                <span className="title">{animeTitle}</span>
                <span className="back">
                  <FontAwesomeIcon className="i" icon={faAngleLeft} />
                  <span className="episode">
                    <span>{`Ep. ${episodeNumber} - `}</span>
                    {episodeTitle}
                  </span>
                </span>
                <span style={{ display: 'none' }}></span>
              </div>
            </div>
            <div className="center"></div>
            <div className="right">
              <div className="settings-content">
                <button className="settings">
                  <FontAwesomeIcon className="i" icon={faGear} />
                </button>
                <div className="settings-options">
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
                    <input type="range" min="0" max="1" step="any" />
                  </li>
                  <li className="playback">
                    <span>
                      <FontAwesomeIcon className="i" icon={faClock} />
                      Speed
                    </span>
                    <select className="main-select-0">
                      <option value="0.25">0.25</option>
                      <option value="0.50">0.50</option>
                      <option value="0.75">0.75</option>
                      <option value="1">Normal</option>
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
                      <option value="85">85 (Default)</option>
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
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </li>
                  <li className="dub">
                    <span>
                      <FontAwesomeIcon className="i" icon={faHeadphones} />
                      Dub
                    </span>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </li>
                  <li className="language">
                    <span>
                      <FontAwesomeIcon className="i" icon={faLanguage} />
                      Language
                    </span>
                    <select className="main-select-0">
                      <option value="US">English</option>
                      <option value="IT">Italian</option>
                    </select>
                  </li>
                </div>
              </div>
              <button className="fullscreen">
                <FontAwesomeIcon className="i" icon={faExpand} />
              </button>
              <button className="next show-next-episode-btn">
                <FontAwesomeIcon className="i" icon={faForward} />
              </button>
            </div>
          </div>
          <div className="mid-controls">
            <button className="skip-backward">
              <FontAwesomeIcon className="i" icon={faRotateLeft} />
            </button>
            <div className="play-pause-center">
              <button className="play-pause">
                <i className="fas fa-play"></i>
                <FontAwesomeIcon className="i" icon={faPlay} />
              </button>
            </div>
            <div>
              <button className="skip-forward">
                <FontAwesomeIcon className="i" icon={faRotateRight} />
              </button>
              <button className="skip-forward-small">
                <FontAwesomeIcon className="i" icon={faRotateRight} />
                {/* <span>85</span> */}
              </button>
            </div>
          </div>
          <div className="bottom-controls">
            <p className="current-time">00:00</p>
            <div className="video-timeline">
              <div className="progress-area">
                <span>00:00</span>
                <div className="video-progress-bar"></div>
              </div>
            </div>
            <p className="video-duration">00:00</p>
          </div>
        </div>
        <video id="video" ref={videoRef}></video>
      </div>
    )
  );
};

export default VideoPlayer;
