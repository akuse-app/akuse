import 'react-activity/dist/Dots.css';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faPlay, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dots from 'react-activity/dist/Dots';
import Skeleton from 'react-loading-skeleton';

interface EpisodeEntryProps {
  onPress: () => void;
  hasInfoLoaded: boolean;
  number: string;
  cover: string | null;
  title: string | null;
  description: string | null;
  releaseDate: string | null;
  duration: string | null;
  progress: number | null;
  loading?: boolean;
}

const EpisodeEntry: React.FC<EpisodeEntryProps> = ({
  onPress,
  hasInfoLoaded,
  number,
  cover,
  title,
  description,
  releaseDate,
  duration,
  progress,
  loading,
}) => {
  progress = Math.ceil(progress ?? 0);
  return (
    <div className="episode-entry" onClick={onPress}>
      {hasInfoLoaded ? (
        <div className="image show-opacity">
          <img src={cover ?? ''} alt="episode cover" />
          <div
            style={{
              width: progress + "%"
            }}
            className={`progress-bar ${
              (progress ?? 0) >= 99 ?
              'full-width' :
              'partial-width'
              }`}/>
          {progress > 0 && <div className='progress-bar-full'/>}
        </div>
      ) : (
        <Skeleton className="image" />
      )}
      <div className="episode-content">
        <div className="title">
          <span>{number}</span>
          {hasInfoLoaded ? title : <Skeleton />}
        </div>
        <div className="info">
          {hasInfoLoaded ? (
            <>
              <span>
                <FontAwesomeIcon
                  className="i"
                  icon={faCalendar}
                  style={{ marginRight: 7 }}
                />
                {releaseDate}
              </span>
              <span>
                <FontAwesomeIcon
                  className="i"
                  icon={faStopwatch}
                  style={{ marginRight: 7 }}
                />
                {duration}
              </span>
            </>
          ) : (
            <span>
              <Skeleton />
            </span>
          )}
        </div>
        <div className="description">
          {hasInfoLoaded ? description : <Skeleton count={4} />}
        </div>
      </div>
    </div>
  );
};

export default EpisodeEntry;
