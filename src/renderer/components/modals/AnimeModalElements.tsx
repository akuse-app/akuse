import 'react-activity/dist/Dots.css';

import {
  faCircleCheck,
  faCircleDot,
  faClock,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBan,
  faChevronDown,
  faChevronUp,
  faFilm,
  faHourglass,
  faPlay,
  faRotate,
  faStopwatch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DOMPurify from 'dompurify';
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  getAvailableEpisodes,
  getEpisodes,
  getParsedFormat,
  getParsedStatus,
  getProgress,
  getTimeUntilAiring,
  parseDescription,
} from '../../../modules/utils';
import { ListAnimeData } from '../../../types/anilistAPITypes';
import { MediaStatus } from '../../../types/anilistGraphQLTypes';
import { AuthContext } from '../../App';
import { ButtonMain, ButtonLoading } from '../Buttons';

interface AnimeModalStatusProps {
  status: MediaStatus | undefined;
}

export const AnimeModalStatus: React.FC<AnimeModalStatusProps> = ({
  status,
}) => {
  const style = getComputedStyle(document.body);
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
      {'Genres: '}
      {genres?.map((genre, index) => (
        <span key={index}>
          {genre}
          {genres?.length! - 1 !== index && ', '}
        </span>
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
      {'Other titles: '}
      {synonyms?.map((title, index) => (
        <span key={index}>
          {title}
          {synonyms?.length! - 1 !== index && ', '}
        </span>
      ))}
    </p>
  );
};

interface AnimeModalEpisodesProps {
  listAnimeData: ListAnimeData;
}

export const AnimeModalEpisodes: React.FC<AnimeModalEpisodesProps> = ({
  listAnimeData,
}) => {
  const format = getParsedFormat(listAnimeData.media.format);
  const duration = listAnimeData.media.duration;
  const status = getParsedStatus(listAnimeData.media.status);
  const episodes = getEpisodes(listAnimeData.media);
  const availableEpisodes = getAvailableEpisodes(listAnimeData.media);

  return (
    <li>
      {format === 'Movie' ? (
        <>
          <FontAwesomeIcon
            className="i"
            icon={faStopwatch}
            style={{ marginRight: 7 }}
          />
          {duration} Minutes
        </>
      ) : (
        <>
          <FontAwesomeIcon
            className="i"
            icon={faFilm}
            style={{ marginRight: 7 }}
          />
          {availableEpisodes} {status === 'Releasing' && ` / ${episodes}`}{' '}
          Episodes
        </>
      )}
    </li>
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
  onPlay: (episode: number) => void;
  loading: boolean;
}

export const AnimeModalWatchButtons: React.FC<AnimeModalWatchButtonsProps> = ({
  listAnimeData,
  onPlay,
  loading = false,
}) => {
  const logged = useContext(AuthContext);

  const progress = getProgress(listAnimeData.media);
  const episodes = getEpisodes(listAnimeData.media);
  const availableEpisodes = getAvailableEpisodes(listAnimeData.media);
  const timeUntilAiring = getTimeUntilAiring(listAnimeData.media);

  return loading ? (
    <div className="watch-buttons">
      <ButtonLoading />
    </div>
  ) : logged ? (
    <div className="watch-buttons">
      {progress === 0 && (
        <ButtonMain
          text="Watch now"
          icon={faPlay}
          tint="light"
          onPress={() => onPlay(1)}
        />
      )}

      {progress === episodes ? (
        <ButtonMain
          text="Watch again"
          icon={faRotate}
          tint="light"
          onPress={() => onPlay(1)}
        />
      ) : (
        progress === availableEpisodes &&
        timeUntilAiring && (
          <ButtonMain
            text={`${timeUntilAiring.days}d ${timeUntilAiring.hours}h ${timeUntilAiring.minutes}m`}
            icon={faHourglass}
            tint="light"
            onPress={() => onPlay(progress + 1)}
          />
        )
      )}

      {progress !== 0 &&
        progress !== episodes &&
        progress !== availableEpisodes && (
          <ButtonMain
            text={`Resume from Ep. ${progress! + 1}`}
            icon={faPlay}
            tint="light"
            onPress={() => onPlay(progress! + 1)}
          />
        )}
    </div>
  ) : (
    <div className="watch-buttons">
      <ButtonMain
        text="Watch now"
        icon={faPlay}
        tint="light"
        onPress={() => {}}
      />
    </div>
  );
};
