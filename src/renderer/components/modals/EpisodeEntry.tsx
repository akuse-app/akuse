import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Skeleton from 'react-loading-skeleton';

interface EpisodeEntryProps {
  hasInfoLoaded: boolean;
  number: string;
  cover: string | null;
  title: string | null;
  description: string | null;
  releaseDate: string | null;
  duration: string | null;
}

const ImageReplacer = () => <div className="image-replacer" />

const EpisodeEntry: React.FC<EpisodeEntryProps> = ({
  hasInfoLoaded,
  number,
  cover,
  title,
  description,
  releaseDate,
  duration,
}) => {
  return (
    <div className="episode-entry">
      {hasInfoLoaded ? <img src={cover ?? ''} alt="episode cover" /> : <Skeleton wrapper={ImageReplacer}/>}
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
