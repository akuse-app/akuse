
import { ListAnimeData } from '../../types/anilistAPITypes';
import AnimeSection from '../components/AnimeSection';
import FeaturedContent from '../components/FeaturedContent';

interface Tab1Props {
  currentListAnime: ListAnimeData[]
  trendingAnime: ListAnimeData[]
  mostPopularAnime: ListAnimeData[]
}

const Tab1: React.FC<Tab1Props> = ({ currentListAnime, trendingAnime, mostPopularAnime }) => {
  // const logged = useContext(AuthContext);

  return (
    <div className="main-container">
      <main>
        <FeaturedContent animeData={trendingAnime}/>

        <div className="section-container">
          {currentListAnime.length !== 0 && (
            <AnimeSection
              title="Continue Watching"
              animeData={currentListAnime}
            />
          )}
          <AnimeSection title="Trending Now" animeData={trendingAnime} />
          <AnimeSection title="Most Popular" animeData={mostPopularAnime} />
        </div>
      </main>
    </div>
  );
};

export default Tab1;
