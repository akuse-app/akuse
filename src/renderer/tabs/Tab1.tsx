import { useEffect } from 'react';
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeSection from '../components/AnimeSection';
import Slideshow from '../components/Slideshow';

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
  return (
    <div className="body-container">
      <div className="main-container">
        <main>
          <Slideshow listAnimeData={trendingAnime} />

          <div className="section-container">
            <AnimeSection
              title="Continue Watching"
              animeData={currentListAnime}
            />

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
