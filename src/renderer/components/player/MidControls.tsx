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
  playing: boolean;
  playVideo: () => void;
  pauseVideo: () => void;
  loading: boolean;
  onClick?: (event: any) => void;
  onDblClick?: (event: any) => void;
}

const MidControls: React.FC<SettingsProps> = ({
  videoRef,
  playing,
  playVideo,
  pauseVideo,
  loading,
  onClick,
  onDblClick,
}) => {
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = () => {
      setIsPaused(false);
    };

    const handlePause = () => {
      setIsPaused(true);
    };

    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      };
    }
  }, [videoRef]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      isPaused ? playVideo() : pauseVideo();
    }
  };

  const handleFastForward = () => {
    try {
      if (videoRef.current) {
        videoRef.current.currentTime += 5;
        setIsPaused(videoRef.current.paused);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFastRewind = () => {
    try {
      if (videoRef.current) {
        videoRef.current.currentTime -= 5;
        setIsPaused(videoRef.current.paused);
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
              <FontAwesomeIcon className="i" icon={isPaused ? faPlay : faPause} />
            </button>
          </div>
          <div>
            <button className="b-player skip-forward" onClick={handleFastForward}>
              <FontAwesomeIcon className="i" icon={faRotateRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MidControls;
