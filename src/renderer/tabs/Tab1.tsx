import { useEffect } from 'react';
import { useContext } from 'react';

import { ListAnimeData } from '../../types/anilistAPITypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import Slideshow from '../components/Slideshow';
import Heading from '../components/Heading';
import UserNavbar from '../components/UserNavbar';

interface Tab1Props {
  currentListAnime?: ListAnimeData[];
  trendingAnime?: ListAnimeData[];
  mostPopularAnime?: ListAnimeData[];
  nextReleasesAnime?: ListAnimeData[];
}

const Tab1: React.FC<Tab1Props> = ({
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
          <Heading text={`Welcome back, al`} />

          <UserNavbar />

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
