import { userInfo } from 'os';
import { useEffect } from 'react';
import { useContext } from 'react';

import { ListAnimeData, UserInfo } from '../../types/anilistAPITypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import Heading from '../components/Heading';
import Slideshow from '../components/Slideshow';
import UserNavbar from '../components/UserNavbar';

interface Tab1Props {
  userInfo?: UserInfo
  currentListAnime?: ListAnimeData[];
  trendingAnime?: ListAnimeData[];
  mostPopularAnime?: ListAnimeData[];
  nextReleasesAnime?: ListAnimeData[];
}

const Tab1: React.FC<Tab1Props> = ({
  userInfo,
  currentListAnime,
  trendingAnime,
  mostPopularAnime,
  nextReleasesAnime,
}) => {
  const logged = useContext(AuthContext);

  return (
    <div className="body-container">
      <div className="main-container">
        <main>
          {/* {logged ? <Heading text={`Welcome back, ${userInfo?.name}`} /> : <Heading text={`Welcome back`} />} */}

          {/* <UserNavbar avatar={userInfo?.avatar?.medium} /> */}

          <Slideshow listAnimeData={trendingAnime} />

          <div className="section-container">
            {logged && (
              <AnimeSection
                title="Continue Watching"
                animeData={currentListAnime}
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
