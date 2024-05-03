import {
  faCircleCheck,
  faCircleDot,
  faClock,
} from '@fortawesome/free-regular-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getParsedStatus } from '../../modules/utils';
import { MediaStatus } from '../../types/anilistGraphQLTypes';
import React from 'react';

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
  genres: string[]
}

export const AnimeModalGenres: React.FC<AnimeModalGenresProps> = ({ genres }) => {
  return (
    <p className="additional-info">
    <span>Genres: </span>
    {genres?.map((genre, index) => (
      <>
        {genre}
        {genres?.length! - 1 !== index &&
          ', '}
      </>
    ))}
  </p>
  )
}

interface AnimeModalOtherTitlesProps {
  synonyms: string[]
}

export const AnimeModalOtherTitles: React.FC<AnimeModalOtherTitlesProps> = ({ synonyms }) => {
  return (
    <p className="additional-info">
    <span>Other titles: </span>
    {synonyms?.map((title, index) => (
      <>
        {title}
        {synonyms?.length! - 1 !== index &&
          ', '}
      </>
    ))}
  </p>
  )
}
