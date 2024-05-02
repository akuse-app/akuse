import { useContext, useEffect, useState } from 'react';

import {
  getMostPopularAnime,
  getTrendingAnime,
  getViewerId,
  getViewerList,
} from '../../modules/anilist/anilistApi';
import { Media } from '../../types/anilistGraphQLTypes';
import { AuthContext } from '../App';
import AnimeSection from '../components/AnimeSection';
import FeaturedContent from '../components/FeaturedContent';
import { ListAnimeData } from '../../types/anilistAPITypes';

const Tab1 = () => {
  // const viewerId = useContext(ViewerIdContext);
  const logged = useContext(AuthContext);

  const [viewerId, setViewerId] = useState<number | null>(null);
  const [currentListAnime, setCurrentListAnime] = useState<ListAnimeData[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<ListAnimeData[]>([]);
  const [mostPopularAnime, setMostPopularAnime] = useState<ListAnimeData[]>([]);

  const loadViewerId = async () => {
    if (logged) setViewerId(await getViewerId());
  };

  const fetchAnimeSectionsData = async () => {
    try {
      var viewerIdLocal = null;

      if (logged) {
        viewerIdLocal = await getViewerId();
        setViewerId(viewerIdLocal);

        setCurrentListAnime(await getViewerList(viewerIdLocal, 'CURRENT'));
      }

      const ta = await getTrendingAnime(viewerId);
      const mpa = await getMostPopularAnime(viewerId);

      if (ta?.media) {
        let data: ListAnimeData[] = [];

        ta.media.forEach((media) => {
          data.push({
            id: null,
            mediaId: null,
            progress: null,
            media: media,
          });
        });

        setTrendingAnime(data);
      }

      if (mpa?.media) {
        let data: ListAnimeData[] = [];

        mpa.media.forEach((media) => {
          data.push({
            id: null,
            mediaId: null,
            progress: null,
            media: media,
          });
        });

        setMostPopularAnime(data);
      }
    } catch (error) {
      console.log('Tab1 error: ' + error);
    }
  };

  useEffect(() => {
    // loadViewerId();
    fetchAnimeSectionsData();
  }, []);

  return (
    <div className="main-container">
      <main>
        <FeaturedContent />
        
        <div className="section-container">
          {logged && (
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
