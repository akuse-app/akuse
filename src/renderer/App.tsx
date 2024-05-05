import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getMostPopularAnime,
  getTrendingAnime,
  getViewerId,
  getViewerList,
} from '../modules/anilist/anilistApi';
import { ListAnimeData } from '../types/anilistAPITypes';
import Navbar from './Navbar';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
import Tab3 from './tabs/Tab3';
import { SkeletonTheme } from 'react-loading-skeleton';

const store = new Store();
export const AuthContext = createContext<boolean>(false);

export default function App() {
  const [logged, setLogged] = useState<boolean>(store.get('logged') as boolean);

  const [currentListAnime, setCurrentListAnime] = useState<ListAnimeData[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<ListAnimeData[]>([]);
  const [mostPopularAnime, setMostPopularAnime] = useState<ListAnimeData[]>([]);

  let style = getComputedStyle(document.body)

  const fetchAnimeData = async () => {
    try {
      var viewerId = null;

      if (logged) {
        viewerId = await getViewerId();
        setCurrentListAnime(await getViewerList(viewerId, 'CURRENT'));
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
    fetchAnimeData();
  }, []);

  return (
    <AuthContext.Provider value={logged}>
      <SkeletonTheme baseColor={style.getPropertyValue('--color-2')} highlightColor={style.getPropertyValue('--color-3')}>
        <MemoryRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <Tab1
                  currentListAnime={currentListAnime}
                  trendingAnime={trendingAnime}
                  mostPopularAnime={mostPopularAnime}
                />
              }
            />
            <Route path="/tab2" element={<Tab2 />} />
            <Route path="/tab3" element={<Tab3 />} />
          </Routes>
        </MemoryRouter>
      </SkeletonTheme>
    </AuthContext.Provider>
  );
}
