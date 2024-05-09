import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getMostPopularAnime,
  getNextReleases,
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
import Tab4 from './tabs/Tab4';
import { animeDataToListAnimeData } from '../modules/utils';

const store = new Store();
export const AuthContext = createContext<boolean>(false);

export default function App() {
  const [logged, setLogged] = useState<boolean>(store.get('logged') as boolean);

  const [currentListAnime, setCurrentListAnime] = useState<ListAnimeData[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<ListAnimeData[]>([]);
  const [mostPopularAnime, setMostPopularAnime] = useState<ListAnimeData[]>([]);
  const [nextReleasesAnime, setNextReleasesAnime] = useState<ListAnimeData[]>([]);

  let style = getComputedStyle(document.body)

  const fetchAnimeData = async () => {
    try {
      var viewerId = null;

      if (logged) {
        viewerId = await getViewerId();
        setCurrentListAnime(await getViewerList(viewerId, 'CURRENT'));
      }

      setTrendingAnime(animeDataToListAnimeData(await getTrendingAnime(viewerId)));
      setMostPopularAnime(animeDataToListAnimeData(await getMostPopularAnime(viewerId)))
      setNextReleasesAnime(animeDataToListAnimeData(await getNextReleases(viewerId)))

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
                  nextReleasesAnime={nextReleasesAnime}
                />
              }
            />
            <Route path="/tab2" element={<Tab2 />} />
            <Route path="/tab3" element={<Tab3 />} />
            <Route path="/tab4" element={<Tab4 />} />
            {/* <Route path="/tab5" element={<Tab5 />} /> */}
          </Routes>
        </MemoryRouter>
      </SkeletonTheme>
    </AuthContext.Provider>
  );
}
