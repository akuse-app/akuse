import { useEffect, useRef, useState } from 'react';
import { formatTime } from '../../../modules/utils';

interface BottomControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  currentTime?: number;
  duration?: number;
  buffered?: TimeRanges;
}

const BottomControls: React.FC<BottomControlsProps> = ({
  videoRef,
  containerRef,
  currentTime,
  duration,
  buffered,
}) => {
  const videoTimeline = useRef<HTMLDivElement>(null);

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const [videoCurrentTime, setVideoCurrentTime] = useState<string>('00:00');
  const [progressTime, setProgressTime] = useState<string>('00:00');
  const [videoDuration, setVideoDuration] = useState<string>('00:00');
  const [remainingtime, setRemainingTime] = useState<string>('00:00');
  const [progressBarWidth, setProgressBarWidth] = useState<string>('0%');
  const [bufferedBarWidth, setBufferedBarWidth] = useState<string>('0%');

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
    <div className="bottom-controls">
      <p className="current-time">{videoCurrentTime}</p>
      <div
        className="video-timeline"
        onClick={dragProgressBar}
        onMouseMove={(event) => {
          if (!isMouseDown) return;
          dragProgressBar(event);
        }}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        ref={videoTimeline}
      >
        <div className="progress-area">
          <div
            className="video-buffered-bar"
            style={{ width: bufferedBarWidth }}
          ></div>
          <span>{videoCurrentTime}</span>
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
