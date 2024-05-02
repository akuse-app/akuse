import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListAnimeData } from '../../types/anilistAPITypes';
import {
  faBan,
  faFilm,
  faStar,
  faTv,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Button2 } from './Buttons';
import {
  getEpisodes,
  getParsedFormat,
  getParsedStatus,
  getTitle,
  parseDescription,
} from '../../modules/utils';
import { MediaStatus } from '../../types/anilistGraphQLTypes';
import {
  faCircleCheck,
  faCircleDot,
  faClock,
} from '@fortawesome/free-regular-svg-icons';

interface AnimeModalProps {
  listAnimeData: ListAnimeData;
  show: boolean;
}

interface AnimeModalStatusProps {
  status: MediaStatus | undefined;
}

const AnimeModalStatus: React.FC<AnimeModalStatusProps> = ({ status }) => {
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

const AnimeModal: React.FC<AnimeModalProps> = ({ listAnimeData, show }) => {
  return (
    <>
      <div
        className="modal-page-shadow-background show-page-shadow-background"
        style={{ display: show ? 'flex' : 'none' }}
      />

      <div
        className={`modal-page-wrapper fade-in show-page`}
        style={{ display: show ? 'flex' : 'none' }}
      >
        <div className="anime-page">
          <button className="exit">
            <FontAwesomeIcon className="i" icon={faXmark} />
          </button>
          <div className="content-wrapper">
            <div className="banner-wrapper">
              {listAnimeData.media.bannerImage && (
                <img src={listAnimeData.media.bannerImage} className="banner" />
              )}
              <div className="watch-buttons">
                <Button2 text="Watch" onPress={() => {}} />
              </div>
            </div>
            <div className="content">
              <div className="left">
                <h1 className="title">{getTitle(listAnimeData.media)}</h1>
                <ul className="info">
                  <li style={{ color: '#e5a639' }}>
                    <FontAwesomeIcon
                      className="i"
                      icon={faStar}
                      style={{ marginRight: 7 }}
                    />
                    {listAnimeData.media.averageScore}%
                  </li>
                  <AnimeModalStatus status={listAnimeData.media.status} />
                  <li>
                    <FontAwesomeIcon
                      className="i"
                      icon={faTv}
                      style={{ marginRight: 7 }}
                    />
                    {getParsedFormat(listAnimeData.media.format)}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      className="i"
                      icon={faFilm}
                      style={{ marginRight: 7 }}
                    />
                    {getEpisodes(listAnimeData.media)} Episodes
                  </li>
                </ul>
                <div className="description">
                  {parseDescription(listAnimeData.media.description ?? '')}
                </div>
                <span className="show-more">show more</span>
              </div>
              <div className="right"></div>
            </div>
            <div className="episodes-section"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimeModal;
