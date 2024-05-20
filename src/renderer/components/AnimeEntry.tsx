import { faCalendar, faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { faHourglass1, faTv } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import {
  getParsedFormat,
  getParsedSeasonYear,
  getTitle,
} from '../../modules/utils';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeModal from './modals/AnimeModal';
import Skeleton from 'react-loading-skeleton';

interface AnimeEntryProps {
  listAnimeData?: ListAnimeData;
}

const AnimeEntry: React.FC<AnimeEntryProps> = ({ listAnimeData }) => {
  // wether the modal is shown or not
  const [showModal, setShowModal] = useState<boolean>(false);
  // wether the modal has been opened at least once (used to fetch episodes info only once when opening it)
  const [hasModalBeenShowed, setHasModalBeenShowed] = useState<boolean>(false);

  return (
    <>
      {listAnimeData && hasModalBeenShowed && (
        <AnimeModal
          listAnimeData={listAnimeData}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      <div
        className={`anime-entry show ${listAnimeData ? '' : 'skeleton'}`}
        onClick={() => {
          setShowModal(true);
          if (!hasModalBeenShowed) setHasModalBeenShowed(true);
        }}
      >
        {listAnimeData ? (
          <div className="anime-cover">
            <img
              src={listAnimeData.media.coverImage?.large}
              alt="anime cover"
            />
          </div>
        ) : (
          <Skeleton className="anime-cover" />
        )}

        <div className="content">
          <div className="anime-title">
            {listAnimeData ? (
              <>
                {listAnimeData.media.status === 'RELEASING' && (
                  <span className='yes'>
                    <FontAwesomeIcon
                      className="i"
                      icon={faCircleDot}
                      style={{ marginRight: 5 }}
                    />
                  </span>
                )}
                {listAnimeData.media.status === 'NOT_YET_RELEASED' && (
                  <span className='no'>
                    <FontAwesomeIcon
                      className="i"
                      icon={faCircleDot}
                      style={{ marginRight: 5 }}
                    />
                  </span>
                )}
                {getTitle(listAnimeData.media)}
              </>
            ) : (
              <Skeleton count={2} />
            )}
          </div>

          <div className="anime-info">
            <div className="season-year">
              {listAnimeData && (
                <FontAwesomeIcon
                  className="i"
                  icon={faCalendar}
                  style={{ marginRight: 5 }}
                />
              )}
              {listAnimeData ? (
                getParsedSeasonYear(listAnimeData?.media)
              ) : (
                <Skeleton />
              )}
            </div>
            <div className="episodes">
              {listAnimeData ? (
                getParsedFormat(listAnimeData?.media.format)
              ) : (
                <Skeleton />
              )}
              {listAnimeData && (
                <FontAwesomeIcon
                  className="i"
                  icon={faTv}
                  style={{ marginLeft: 5 }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimeEntry;
