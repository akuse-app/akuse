import {
  faCircleCheck,
  faCircleDot,
  faClock,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBan,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';

import { getParsedStatus, parseDescription } from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import { MediaStatus } from '../../types/anilistGraphQLTypes';

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
        <>
          {genre}
          {genres?.length! - 1 !== index && ', '}
        </>
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
        <>
          {title}
          {synonyms?.length! - 1 !== index && ', '}
        </>
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

  const isEllipsisActive = () => {
    const clientHeight = descriptionRef.current?.clientHeight!;
    const scrollHeight = descriptionRef.current?.scrollHeight!;

    console.log(clientHeight);
    console.log(scrollHeight);

    return scrollHeight > clientHeight;
  };

  useEffect(() => {
    // isEllipsisActive();
  }, []);

  return (
    <>
      <div
        ref={descriptionRef}
        className={`description ${fullText ? '' : 'cropped'}`}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            parseDescription(listAnimeData.media.description ?? ''),
          ),
        }}
      ></div>
      <span
        className="show-more show-element"
        // className={`show-more ${ellipsis ? 'show-element' : ''}`}
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
