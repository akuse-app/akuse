import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getMostPopularAnime,
  getNextReleases,
  getTrendingAnime,
  getUserInfo,
  getViewerId,
  getViewerInfo,
  getViewerList,
} from '../modules/anilist/anilistApi';
import { animeDataToListAnimeData } from '../modules/utils';
import { ListAnimeData, UserInfo } from '../types/anilistAPITypes';
import MainNavbar from './MainNavbar';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
import Tab3 from './tabs/Tab3';
import Tab4 from './tabs/Tab4';

import { setDefaultStoreVariables } from '../modules/storeVariables';
import { ipcRenderer } from 'electron';
import AutoUpdateModal from './components/modals/AutoUpdateModal';
import WindowControls from './WindowControls';
import { OS } from '../modules/os';
import { MediaListCollection } from '../types/anilistGraphQLTypes';

ipcRenderer.on('console-log', (event, toPrint) => {
  console.log(toPrint);
});

const store = new Store();
export const AuthContext = createContext<boolean>(false);
export const ViewerIdContext = createContext<number | null>(null);

export default function App() {
  const [logged, setLogged] = useState<boolean>(store.get('logged') as boolean);
  const [viewerId, setViewerId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  setDefaultStoreVariables();

  ipcRenderer.on('auto-update', async () => {
    setShowUpdateModal(true);
  });
  ipcRenderer.send("update-presence", {})

  // tab1
  const [userInfo, setUserInfo] = useState<UserInfo>();

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

  // tab4
  const [tab4Click, setTab4Click] = useState<boolean>(false);
  const [detailedUserInfo, setDetailedUserInfo] =
    useState<MediaListCollection>();

  const style = getComputedStyle(document.body);

  const fetchTab1AnimeData = async () => {
    try {
      var id = null;
      if (logged) {
        id = await getViewerId();
        setViewerId(id);

        setUserInfo(await getViewerInfo(id));
        const current = await getViewerList(id, 'CURRENT');
        const rewatching = await getViewerList(id, 'REPEATING');
        setCurrentListAnime(current.concat(rewatching));
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

  const fetchTab4AnimeData = async () => {
    try {
      var id = null;
      if (logged) {
        id = await getViewerId();
        setViewerId(id);

        setDetailedUserInfo(await getUserInfo(id));
      }
    } catch (error) {
      console.log('Tab4 error: ' + error);
    }
  };

  useEffect(() => {
    fetchTab1AnimeData();
  }, []);

  useEffect(() => {
    if (tab4Click) {
      fetchTab4AnimeData();
    }
  }, [tab4Click, viewerId]);

  return (
    <AuthContext.Provider value={logged}>
      <ViewerIdContext.Provider value={viewerId}>
        <SkeletonTheme
          baseColor={style.getPropertyValue('--color-3')}
          highlightColor={style.getPropertyValue('--color-4')}
        >
          <AutoUpdateModal
            show={showUpdateModal}
            onClose={() => {
              setShowUpdateModal(false);
            }}
          />
          <MemoryRouter>
            {!OS.isMac && <WindowControls />}
            <MainNavbar avatar={userInfo?.avatar?.medium} />
            <Routes>
              <Route
                path="/"
                element={
                  <Tab1
                    userInfo={userInfo}
                    currentListAnime={currentListAnime}
                    trendingAnime={trendingAnime}
                    mostPopularAnime={mostPopularAnime}
                    nextReleasesAnime={nextReleasesAnime}
                  />
                }
              />
              <Route path="/tab2" element={<Tab2 />} />
              <Route path="/tab3" element={<Tab3 />} />
              {logged && (
                <Route
                  path="/tab4"
                  element={
                    <Tab4
                      detailedUserInfo={detailedUserInfo}
                      clicked={() => {
                        !tab4Click && setTab4Click(true);
                      }}
                    />
                  }
                />
              )}
            </Routes>
          </MemoryRouter>
        </SkeletonTheme>
      </ViewerIdContext.Provider>
    </AuthContext.Provider>
  );
}
