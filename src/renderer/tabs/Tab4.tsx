import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import Heading from '../components/Heading';
import AnimeEntry from '../components/AnimeEntry';
import UserModal from '../components/modals/UserModal';

interface Tab5Props {
  detailedUserInfo?: any;
  clicked: () => void;
}

function convertMinutesToDays(minutes: any) {
  const hours: any = minutes / 60;
  const days: any = hours / 24;

  if (days >= 1) {
    return days % 1 === 0
      ? { days: `${parseInt(days)}` }
      : { days: `${days.toFixed(1)}` };
  } else {
    return hours % 1 === 0
      ? { hours: `${parseInt(hours)}` }
      : { hours: `${hours.toFixed(1)}` };
  }
}

const Tab4: React.FC<Tab5Props> = ({ detailedUserInfo, clicked }) => {
  useEffect(() => {
    clicked();
  });

  const filterMedia = (status: any) => {
    if (status === 'all') {
      return detailedUserInfo?.lists;
    }
    return detailedUserInfo?.lists.filter((m: any) => m.name === status);
  };

  const [listFilter, setListFilter] = useState('Completed');
  const [showUserModal, setShowUserModal] = useState<boolean>(false);

  const logged = useContext(AuthContext);
  const time = convertMinutesToDays(
    detailedUserInfo?.user?.statistics?.anime?.minutesWatched,
  );

  return (
    <>
      <UserModal show={showUserModal} onClose={() => setShowUserModal(false)} />
      <div className="body-container  show-tab">
        <div className="main-container">
          {logged && (
            <div className="user-page">
              <Heading text="User" />
              <div className="user-info">
                <div className="user-avatar">
                  <img
                    src={detailedUserInfo?.user?.avatar?.large}
                    alt="avatar"
                  />
                </div>
                <div className="user-name">
                  <p>{detailedUserInfo?.user?.name}</p>
                  <div
                    className="user-logout"
                    onClick={() => {
                      setShowUserModal(true);
                    }}
                  >
                    Logout
                  </div>
                </div>
                <div className="user-stats">
                  <div>
                    <h1>
                      {
                        detailedUserInfo?.user?.statistics?.anime
                          ?.episodesWatched
                      }
                    </h1>
                    <h2>Total Episodes</h2>
                  </div>
                  <div>
                    <h1>{detailedUserInfo?.user?.statistics?.anime?.count}</h1>
                    <h2>Total Anime</h2>
                  </div>
                  <div>
                    <h1>{detailedUserInfo?.user?.statistics?.anime?.meanScore.toFixed(2)}</h1>
                    <h2>Average Score</h2>
                  </div>
                  {time?.days ? (
                    <div>
                      <h1>{time.days}</h1>
                      <h2>Days Watched</h2>
                    </div>
                  ) : (
                    <div>
                      <h1>{time.hours}</h1>
                      <h2>hours</h2>
                    </div>
                  )}
                </div>
              </div>
              <div className="anime-content">
                <div className="filters-content">
                  <ul>
                    {detailedUserInfo?.lists?.map((item: any) => (
                      <li
                        key={item.name}
                        onClick={() => {
                          setListFilter(item.name);
                        }}
                        className={`${listFilter === item.name}`}
                      >
                        <h1>{item.name}</h1>
                        <div
                          style={{ fontSize: '0.8rem' }}
                        >
                          ({item.entries?.length})
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <main className="content-wrapper">
                  {detailedUserInfo?.lists.length !== 0 ? (
                    filterMedia(listFilter)?.map((item: any, index: any) => {
                      return (
                        <div className="entries-container">
                          {item?.entries.map((item: any) => {
                            return (
                              <AnimeEntry
                                key={item.mediaId}
                                listAnimeData={item}
                              />
                            );
                          })}
                        </div>
                      );
                    })
                  ) : (
                    <div></div>
                  )}
                </main>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Tab4;
