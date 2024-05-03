import {
  faFilm,
  faStar,
  faTv,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactDOM from 'react-dom';

import {
  capitalizeFirstLetter,
  getEpisodes,
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import {
  AnimeModalDescription,
  AnimeModalGenres,
  AnimeModalOtherTitles,
  AnimeModalStatus,
} from './AnimeModalElements';
import { Button2 } from './Buttons';

const modalsRoot = document.getElementById('modals-root');

interface AnimeModalProps {
  listAnimeData: ListAnimeData;
  show: boolean;
  onXPress: () => void;
}

const AnimeModal: React.FC<AnimeModalProps> = ({
  listAnimeData,
  show,
  onXPress,
}) => {
  return ReactDOM.createPortal(
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
          <div className="content-wrapper">
            <button className="exit" onClick={onXPress}>
              <FontAwesomeIcon className="i" icon={faXmark} />
            </button>
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
                <AnimeModalDescription listAnimeData={listAnimeData}/>
              </div>
              <div className="right">
                <p className="additional-info">
                  <span>Released on: </span>
                  {capitalizeFirstLetter(
                    listAnimeData.media.season ?? '?',
                  )}{' '}
                  {getParsedSeasonYear(listAnimeData.media)}
                </p>
                <AnimeModalGenres genres={listAnimeData.media.genres ?? []} />
                <AnimeModalOtherTitles
                  synonyms={listAnimeData.media.synonyms ?? []}
                />
              </div>
            </div>
            <div className="episodes-section"></div>
          </div>
        </div>
      </div>
    </>,
    modalsRoot!,
  );
};

export default AnimeModal;
