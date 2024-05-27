import 'react-activity/dist/Dots.css';
import {
  faPause,
  faPlay,
  faRotateLeft,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import Dots from 'react-activity/dist/Dots';

interface SettingsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  playVideo: () => void;
  pauseVideo: () => void;
  loading: boolean;
  onClick?: (event: any) => void;
  onDblClick?: (event: any) => void;
}

const MidControls: React.FC<SettingsProps> = ({
  videoRef,
  playVideo,
  pauseVideo,
  loading,
  onClick,
  onDblClick,
}) => {
  const [playing, setPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        pauseVideo();
        setPlaying(false);
      } else {
        playVideo();
        setPlaying(true);
      }
    }
  };

  const handleFastRewind = () => {
    try {
      if (videoRef.current) {
        videoRef.current.currentTime -= 5;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFastForward = () => {
    try {
      if (videoRef.current) {
        videoRef.current.currentTime += 5;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mid-controls" onClick={onClick} onDoubleClick={onDblClick}>
      {loading ? (
        <Dots />
      ) : (
        <>
          <button className="b-player skip-backward" onClick={handleFastRewind}>
            <FontAwesomeIcon className="i" icon={faRotateLeft} />
          </button>
          <div className="b-player play-pause-center">
            <button className="b-player play-pause" onClick={handlePlayPause}>
              <i className="fas fa-play"></i>
              <FontAwesomeIcon
                className="i"
                icon={playing ? faPause : faPlay}
              />
            </button>
          </div>
          <div>
            <button
              className="b-player skip-forward"
              onClick={handleFastForward}
            >
              <FontAwesomeIcon className="i" icon={faRotateRight} />
            </button>
            {/* <button className="b-player skip-forward-small">
          <FontAwesomeIcon className="i" icon={faRotateRight} />
        </button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default MidControls;
