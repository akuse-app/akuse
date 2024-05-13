interface BottomControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  currentTime: string;
  remainingtime: string;
  bufferedBarWidth: string;
  progressBarWidth: string;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  videoRef,
  currentTime,
  remainingtime,
  bufferedBarWidth,
  progressBarWidth,
}) => {
  return (
    <div className="bottom-controls">
      <p className="current-time">{currentTime}</p>
      <div className="video-timeline">
        <div className="progress-area">
          <div
            className="video-buffered-bar"
            style={{ width: bufferedBarWidth }}
          ></div>
          <span>{currentTime}</span>
          <div
            className="video-progress-bar"
            style={{ width: progressBarWidth }}
          ></div>
        </div>
      </div>
      <p className="video-duration">-{remainingtime}</p>
    </div>
  );
};

export default BottomControls;
