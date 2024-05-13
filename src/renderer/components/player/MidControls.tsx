import 'react-activity/dist/Dots.css';

import { faPause, faPlay, faRotateLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import Dots from 'react-activity/dist/Dots';

interface SettingsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  playing: boolean
  playVideo: () => void
  pauseVideo: () => void
  loading: boolean
  onClick?: (event: any) => void
  onDblClick?: (event: any) => void
}

const MidControls: React.FC<SettingsProps> = ({ videoRef, playing, playVideo, pauseVideo, loading, onClick, onDblClick }) => {
  const handlePlayPause = () => {
    if (videoRef.current) {
      playing ? pauseVideo() : playVideo();
    }
  };

  const handleFastRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
  };

  const handleFastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  return (
    <div className="mid-controls" onClick={onClick} onDoubleClick={onDblClick}>
      {loading ? (
        <Dots />
      ) : (
        <>
          <button className="skip-backward" onClick={handleFastRewind}>
            <FontAwesomeIcon className="i" icon={faRotateLeft} />
          </button>
          <div className="play-pause-center">
            <button className="play-pause" onClick={handlePlayPause}>
              <i className="fas fa-play"></i>
              <FontAwesomeIcon
                className="i"
                icon={playing ? faPause : faPlay}
              />
            </button>
          </div>
          <div>
            <button className="skip-forward" onClick={handleFastForward}>
              <FontAwesomeIcon className="i" icon={faRotateRight} />
            </button>
            {/* <button className="skip-forward-small">
          <FontAwesomeIcon className="i" icon={faRotateRight} />
        </button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default MidControls;
