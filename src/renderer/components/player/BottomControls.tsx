import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../../../modules/utils';

interface BottomControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  currentTime?: number;
  duration?: number;
  buffered?: TimeRanges;
  onClick?: (event: any) => void;
  onDblClick?: (event: any) => void;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  videoRef,
  containerRef,
  currentTime,
  duration,
  buffered,
  onClick,
  onDblClick,
}) => {
  const videoTimelineRef = useRef<HTMLDivElement>(null);

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const [videoCurrentTime, setVideoCurrentTime] = useState<string>('00:00');
  const [progressTime, setProgressTime] = useState<string>('00:00');
  const [videoDuration, setVideoDuration] = useState<string>('00:00');
  const [remainingtime, setRemainingTime] = useState<string>('00:00');
  const [progressBarWidth, setProgressBarWidth] = useState<string>('0%');
  const [bufferedBarWidth, setBufferedBarWidth] = useState<string>('0%');

  const [previewThumbnailSrc, setPreviewThumbnailSrc] = useState<string>('');

  // start
  useEffect(() => {
    setVideoCurrentTime(formatTime(videoRef.current?.currentTime ?? 0));
    setVideoDuration(formatTime(videoRef.current?.duration ?? 0));
    setProgressBarWidth('0%');
    setBufferedBarWidth('0%');
  }, []);

  useEffect(() => {
    setVideoCurrentTime(formatTime(currentTime ?? 0));
    setRemainingTime(formatTime((duration ?? 0) - (currentTime ?? 0)));
    setProgressBarWidth(`${((currentTime ?? 0) / (duration ?? 0)) * 100}%`);

    if (videoRef.current && buffered && buffered.length > 0) {
      setBufferedBarWidth(`${(buffered.end(0) / (duration ?? 0)) * 100}%`);
    }
  }, [currentTime, duration, buffered]);

  useEffect(() => {
    window.addEventListener('mouseup', () => {
      setIsMouseDown(false);
    });
  });

  const [offsetX, setOffsetX] = useState(0);
  const [percent, setPercent] = useState(0);

  // Funzione per calcolare il tempo in base alla posizione sull'asse X
  const calculateTime = (event: any) => {
    if (!videoTimelineRef.current || !duration) return;

    let timelineWidth = videoTimelineRef.current.clientWidth;
    const newOffsetX = event.nativeEvent.offsetX;
    const newPercent = Math.floor((newOffsetX / timelineWidth) * duration);
    const clampedOffsetX =
      newOffsetX < 20
        ? 20
        : newOffsetX > timelineWidth - 20
        ? timelineWidth - 20
        : newOffsetX;

    setOffsetX(clampedOffsetX);
    setPercent(newPercent);
  };

  const dragProgressBar = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const timeline = event.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const percentage = offsetX / timeline.clientWidth;

    const newTime = percentage * videoRef.current.duration;
    setProgressBarWidth(`${((newTime ?? 0) / (duration ?? 0)) * 100}%`);
    videoRef.current.currentTime = newTime;
  };

  return (
    <div
      className="bottom-controls"
      onClick={onClick}
      onDoubleClick={onDblClick}
    >
      <p className="current-time">{videoCurrentTime}</p>
      <div
        className="video-timeline"
        onClick={dragProgressBar}
        onMouseMove={(event) => {
          calculateTime(event);
          if (!isMouseDown) return;
          dragProgressBar(event);
        }}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        ref={videoTimelineRef}
      >
        <div className="progress-area">
          <div
            className="video-buffered-bar"
            style={{ width: bufferedBarWidth }}
          ></div>
          {/* <div className="preview-thumbnail">
            <img src={previewThumbnailSrc} alt="preview" />
            <div className="time">
              <span>{videoCurrentTime}</span>
              </div>
            </div> */}
          <span style={{ left: `${offsetX}px` }}>{formatTime(percent)}</span>
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
