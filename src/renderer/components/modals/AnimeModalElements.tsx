import {
  faCircleCheck,
  faCircleDot,
  faClock,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBan,
  faChevronDown,
  faChevronUp,
  faHourglass,
  faPlay,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DOMPurify from 'dompurify';
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  getAvailableEpisodes,
  getEpisodes,
  getParsedStatus,
  getProgress,
  getTimeUntilAiring,
  parseDescription,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { MediaStatus } from '../../../types/anilistGraphQLTypes';
import { Button2 } from '../Buttons';
import { AuthContext } from '../../App';

interface AnimeModalStatusProps {
  status: MediaStatus | undefined;
}

export const AnimeModalStatus: React.FC<AnimeModalStatusProps> = ({
  status,
}) => {
  let style = getComputedStyle(document.body);
  const parsedStatus = getParsedStatus(status);

  return (
    <>
      {status === 'FINISHED' && (
        <li>
          <FontAwesomeIcon
            className="i"
            icon={faCircleCheck}
            style={{ marginRight: 7 }}
          />
          {parsedStatus}
        </li>
      )}
      {status === 'RELEASING' && (
        <li style={{ color: style.getPropertyValue('--color-success') }}>
          <FontAwesomeIcon
            className="i"
            icon={faCircleDot}
            style={{ marginRight: 7 }}
          />
          {parsedStatus}
        </li>
      )}
      {status === 'NOT_YET_RELEASED' && (
        <li style={{ color: style.getPropertyValue('--color-alert') }}>
          <FontAwesomeIcon
            className="i"
            icon={faClock}
            style={{ marginRight: 7 }}
          />
          {parsedStatus}
        </li>
      )}
      {(status === 'CANCELLED' || status === 'HIATUS') && (
        <li style={{ color: style.getPropertyValue('--color-warning') }}>
          <FontAwesomeIcon
            className="i"
            icon={faBan}
            style={{ marginRight: 7 }}
          />
          {parsedStatus}
        </li>
      )}
    </>
  );
};

interface AnimeModalGenresProps {
  genres: string[];
}

export const AnimeModalGenres: React.FC<AnimeModalGenresProps> = ({
  genres,
}) => {
  return (
    <p className="additional-info">
      <span>Genres: </span>
      {genres?.map((genre, index) => (
        <div key={index}>
          {genre}
          {genres?.length! - 1 !== index && ', '}
        </div>
      ))}
    </p>
  );
};

interface AnimeModalOtherTitlesProps {
  synonyms: string[];
}

export const AnimeModalOtherTitles: React.FC<AnimeModalOtherTitlesProps> = ({
  synonyms,
}) => {
  return (
    <p className="additional-info">
      <span>Other titles: </span>
      {synonyms?.map((title, index) => (
        <div key={index}>
          {title}
          {synonyms?.length! - 1 !== index && ', '}
        </div>
      ))}
    </p>
  );
};

interface AnimeModalDescriptionProps {
  listAnimeData: ListAnimeData;
}

export const AnimeModalDescription: React.FC<AnimeModalDescriptionProps> = ({
  listAnimeData,
}) => {
  const descriptionRef = useRef<HTMLDivElement>(null);

  const [fullText, setFullText] = useState<boolean>(false);
  const [ellipsis, setEllpisis] = useState<boolean>(false);

  const handleToggleFullText = () => {
    setFullText(!fullText);
  };

  const isEllipsisActive = () =>
    descriptionRef.current?.scrollHeight! >
    descriptionRef.current?.clientHeight!;

  useEffect(() => {
    setTimeout(() => {
      isEllipsisActive();
    }, 100);
  });

  return (
    <>
      <div
        ref={descriptionRef}
        className={`description ${fullText ? '' : 'cropped'}`}
        // onClick={handleToggleFullText}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            parseDescription(listAnimeData.media.description ?? ''),
          ),
        }}
      ></div>
      <span></span>
      <span
        // className="show-more show-element"
        className={`show-more ${ellipsis ? 'show-element' : ''}`}
        onClick={handleToggleFullText}
      >
        {fullText ? (
          <>
            <FontAwesomeIcon
              className="i"
              icon={faChevronUp}
              style={{ marginRight: 7 }}
            />
            Show less
          </>
        ) : (
          <>
            <FontAwesomeIcon
              className="i"
              icon={faChevronDown}
              style={{ marginRight: 7 }}
            />
            Show more
          </>
        )}
      </span>
    </>
  );
};

interface AnimeModalWatchButtonsProps {
  listAnimeData: ListAnimeData;
}

export const AnimeModalWatchButtons: React.FC<AnimeModalWatchButtonsProps> = ({
  listAnimeData,
}) => {
  const logged = useContext(AuthContext);

  const progress = getProgress(listAnimeData.media);
  const episodes = getEpisodes(listAnimeData.media);
  const availableEpisodes = getAvailableEpisodes(listAnimeData.media);
  const timeUntilAiring = getTimeUntilAiring(listAnimeData.media);

  return logged ? (
    <div className="watch-buttons">
      {progress === 0 && (
        <Button2 text="Start watching" icon={faPlay} onPress={() => {}} />
      )}

      {progress === episodes ? (
        <Button2 text="Watch again" icon={faRotate} onPress={() => {}} />
      ) : (
        progress === availableEpisodes &&
        timeUntilAiring && (
          <Button2
            text={`${timeUntilAiring.days}d ${timeUntilAiring.hours}h ${timeUntilAiring.minutes}m`}
            icon={faHourglass}
            onPress={() => {}}
          />
        )
      )}

      {progress !== 0 &&
        progress !== episodes &&
        progress !== availableEpisodes && (
          <Button2
            text={`Resume from Ep. ${progress ?? 0 + 1}`}
            icon={faPlay}
            onPress={() => {}}
          />
        )}
    </div>
  ) : (
    <></>
  );
};
