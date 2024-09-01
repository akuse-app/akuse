import { useContext } from 'react';

import { ListAnimeData, UserInfo } from '../../types/anilistAPITypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import Heading from '../components/Heading';
import Slideshow from '../components/Slideshow';
import UserNavbar from '../components/UserNavbar';
import Store from 'electron-store';

const store = new Store();
interface Tab1Props {
  userInfo?: UserInfo
  currentListAnime?: ListAnimeData[];
  trendingAnime?: ListAnimeData[];
  mostPopularAnime?: ListAnimeData[];
  nextReleasesAnime?: ListAnimeData[];
  bookmarkAnime?: ListAnimeData[];
}

const Tab1: React.FC<Tab1Props> = ({
  userInfo,
  currentListAnime,
  bookmarkAnime,
  trendingAnime,
  mostPopularAnime,
  nextReleasesAnime
}) => {
  const hasHistory = useContext(AuthContext);
  const logged = store.get('logged') as boolean;

  return (
    <div className="body-container  show-tab">
      <div className="main-container" style={{ paddingBottom: "110px" }} >
        <main>
          {/* {logged ? <Heading text={`Welcome back, ${userInfo?.name}`} /> : <Heading text={`Welcome back`} />} */}

          {/* <UserNavbar avatar={userInfo?.avatar?.medium} /> */}

          <Slideshow listAnimeData={trendingAnime} />

          <div className="section-container">
            {hasHistory && (
              <AnimeSection
                title="Continue Watching"
                animeData={currentListAnime}
              />
            )}
            {/* {newAnime && (
              <AnimeSection
                title="Just Aired"
                animeData={newAnime}
              />
            )} */}
            {logged && bookmarkAnime?.length !== 0 &&  (
              <AnimeSection
                title="Watchlist"
                animeData={bookmarkAnime}
              />
            )}
            <AnimeSection title="Trending Now" animeData={trendingAnime} />
            <AnimeSection title="Most Popular" animeData={mostPopularAnime} />
            <AnimeSection title="Next Releases" animeData={nextReleasesAnime} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tab1;
