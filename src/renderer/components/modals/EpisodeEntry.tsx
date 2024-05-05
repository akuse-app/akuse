import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface EpisodeEntryProps {
  infoLoaded: boolean;
  number: string;
  cover: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: string;
}

const EpisodeEntry: React.FC<EpisodeEntryProps> = ({
  infoLoaded,
  number,
  cover,
  title,
  description,
  releaseDate,
  duration,
}) => {
  return (
    <div className="episode-entry">
      <img src={cover} alt="episode cover" />
      <div className="episode-content">
        <div className="title">
          <span>{number}</span>
          {title}
        </div>
        {infoLoaded && (
          <div className="info">
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
          </div>
        )}
        <div className="description">{description}</div>
      </div>
    </div>
  );
};

export default EpisodeEntry;
