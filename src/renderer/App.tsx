import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import '../styles/videoPlayer.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getMostPopularAnime,
  getNextReleases,
  getTrendingAnime,
  getViewerId,
  getViewerList,
} from '../modules/anilist/anilistApi';
import { animeDataToListAnimeData } from '../modules/utils';
import { ListAnimeData } from '../types/anilistAPITypes';
import Navbar from './Navbar';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
import Tab3 from './tabs/Tab3';
import Tab4 from './tabs/Tab4';

import { setDefaultSourceFlag } from '../modules/storeVariables';

const store = new Store();
export const AuthContext = createContext<boolean>(false);
export const ViewerIdContext = createContext<number | null>(null);

export default function App() {
  const [logged, setLogged] = useState<boolean>(store.get('logged') as boolean);
  const [viewerId, setViewerId] = useState<number | null>(null);

  setDefaultSourceFlag();

  // tab1
  const [currentListAnime, setCurrentListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [trendingAnime, setTrendingAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [mostPopularAnime, setMostPopularAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [nextReleasesAnime, setNextReleasesAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);

  // tab2
  const [tab2Click, setTab2Click] = useState<boolean>(false);
  const [planningListAnime, setPlanningListAnimeListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [completedListAnime, setCompletedListAnimeListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [droppedListAnime, setDroppedListAnimeListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [pausedListAnime, setPausedListAnimeListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  const [RepeatingListAnime, setRepeatingListAnimeListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);

  let style = getComputedStyle(document.body);

  const fetchTab1AnimeData = async () => {
    try {
      var id = null;
      if (logged) {
        id = await getViewerId();
        setViewerId(id);
        setCurrentListAnime(await getViewerList(id, 'CURRENT'));
      }

      setTrendingAnime(animeDataToListAnimeData(await getTrendingAnime(id)));
      setMostPopularAnime(
        animeDataToListAnimeData(await getMostPopularAnime(id)),
      );
      setNextReleasesAnime(animeDataToListAnimeData(await getNextReleases(id)));
    } catch (error) {
      console.log('Tab1 error: ' + error);
    }
  };

  const fetchTab2AnimeData = async () => {
    try {
      if (viewerId) {
        setPlanningListAnimeListAnime(
          await getViewerList(viewerId, 'PLANNING'),
        );
        setCompletedListAnimeListAnime(
          await getViewerList(viewerId, 'COMPLETED'),
        );
        setDroppedListAnimeListAnime(await getViewerList(viewerId, 'DROPPED'));
        setPausedListAnimeListAnime(await getViewerList(viewerId, 'PAUSED'));
        setRepeatingListAnimeListAnime(
          await getViewerList(viewerId, 'REPEATING'),
        );
      }
    } catch (error) {
      console.log('Tab2 error: ' + error);
    }
  };

  useEffect(() => {
    fetchTab1AnimeData();
  }, []);

  useEffect(() => {
    if (tab2Click) {
      fetchTab2AnimeData();
    }
  }, [tab2Click, viewerId]);

  return (
    <AuthContext.Provider value={logged}>
      <ViewerIdContext.Provider value={viewerId}>
        <SkeletonTheme
          baseColor={style.getPropertyValue('--color-3')}
          highlightColor={style.getPropertyValue('--color-4')}
        >
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
              {logged && (
                <Route
                  path="/tab2"
                  element={
                    <Tab2
                      planningListAnime={planningListAnime}
                      completedListAnime={completedListAnime}
                      droppedListAnime={droppedListAnime}
                      pausedListAnime={pausedListAnime}
                      repeatingListAnime={RepeatingListAnime}
                      clicked={() => {
                        !tab2Click && setTab2Click(true);
                      }}
                    />
                  }
                />
              )}
              <Route path="/tab3" element={<Tab3 />} />
              <Route path="/tab4" element={<Tab4 />} />
            </Routes>
          </MemoryRouter>
        </SkeletonTheme>
      </ViewerIdContext.Provider>
    </AuthContext.Provider>
  );
}
