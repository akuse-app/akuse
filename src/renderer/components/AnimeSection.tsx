import { faCalendar, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeModal from './modals/AnimeModal';

interface AnimeSectionProps {
  title: string;
  animeData: ListAnimeData[];
}

interface AnimeEntryProps {
  listAnimeData: ListAnimeData;
}

const AnimeEntry: React.FC<AnimeEntryProps> = ({ listAnimeData }) => {
  
  // wether the modal is shown or not
  const [showModal, setShowModal] = useState<boolean>(false);
  // wether the modal has been opened at least once (used to fetch episodes info only once when opening it)
  const [hasModalBeenShowed, setHasModalBeenShowed] = useState<boolean>(false);

  return (
    <>
      {hasModalBeenShowed && (
        <AnimeModal
          listAnimeData={listAnimeData}
          show={showModal}
          onXPress={() => setShowModal(false)}
        />
      )}

      <div
        className="anime-entry show"
        onClick={() => {
          setShowModal(true);
          if(!hasModalBeenShowed) setHasModalBeenShowed(true)
        }}
      >
        <div className="anime-cover">
          <img src={listAnimeData.media.coverImage?.large} alt="anime cover" />
        </div>
        <div className="content">
          <div className="anime-title">
            {listAnimeData.media.status === 'RELEASING' && (
              <span>
                <FontAwesomeIcon
                  className="i"
                  icon={faCircleDot}
                  style={{ marginRight: 5 }}
                />
              </span>
            )}
            {getTitle(listAnimeData.media)}
          </div>

          <div className="anime-info">
            <div className="season-year">
              <FontAwesomeIcon
                className="i"
                icon={faCalendar}
                style={{ marginRight: 5 }}
              />
              {getParsedSeasonYear(listAnimeData.media)}
            </div>

            <div className="episodes">
              {getParsedFormat(listAnimeData.media.format)}
              <FontAwesomeIcon
                className="i"
                icon={faCalendar}
                style={{ marginLeft: 5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const AnimeSection: React.FC<AnimeSectionProps> = ({ title, animeData }) => {
  return (
    <section>
      <h1>{title}</h1>
      <div className="anime-list-wrapper">
        <div className="anime-list">
          {animeData.map((listAnimeData, index) => (
            <AnimeEntry key={index} listAnimeData={listAnimeData} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimeSection;
