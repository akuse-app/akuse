import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getAiringSchedule,
  getMostPopularAnime,
  getNextReleases,
  getTrendingAnime,
  getViewerId,
  getViewerInfo,
  getViewerList,
  getAnimesFromTitles,
  getAiredAnime
} from '../modules/anilist/anilistApi';

import { getRecentEpisodes } from '../modules/providers/gogoanime';
import { airingDataToListAnimeData, animeDataToListAnimeData } from '../modules/utils';
import { ListAnimeData, UserInfo } from '../types/anilistAPITypes';
import MainNavbar from './MainNavbar';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
import Tab3 from './tabs/Tab3';
import Tab4 from './tabs/Tab4';

import { setDefaultStoreVariables } from '../modules/storeVariables';
import { IpcRenderer, ipcRenderer, IpcRendererEvent } from 'electron';
import AutoUpdateModal from './components/modals/AutoUpdateModal';
import WindowControls from './WindowControls';
import { OS } from '../modules/os';
import DonateModal from './components/modals/DonateModal';
import { getHistoryEntries, getLastWatchedEpisode } from '../modules/history';
import Tab5 from './tabs/Tab5';
import { AnimeHistoryEntry } from '../types/historyTypes';

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
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);
  const [hasHistory, setHasHistory] = useState<boolean>(false);

  // tab1
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentListAnime, setCurrentListAnime] = useState<ListAnimeData[]>();
  const [trendingAnime, setTrendingAnime] = useState<ListAnimeData[]>();
  const [mostPopularAnime, setMostPopularAnime] = useState<ListAnimeData[]>();
  const [nextReleasesAnime, setNextReleasesAnime] = useState<ListAnimeData[]>();
  // tab2
  const [tab2Click, setTab2Click] = useState<boolean>(false);
  const [planningListAnime, setPlanningListAnimeListAnime] =
    useState<ListAnimeData[]>();

  const style = getComputedStyle(document.body);
  setDefaultStoreVariables();

  useEffect(() => {
    fetchTab1AnimeData();
  }, []);

  useEffect(() => {
    if (tab2Click) {
      fetchTab2AnimeData();
    }
  }, [tab2Click, viewerId]);

  useEffect(() => {
    if (Math.floor(Math.random() * 8) + 1 === 1 && !showUpdateModal) {
      setShowDonateModal(true);
    }
  }, []);

  const updateHistory = async () => {
    const entries = getHistoryEntries();
    const historyAvailable = Object.values(entries).length > 0

    let result: ListAnimeData[] = [];
    const sortNewest = (a: ListAnimeData, b: ListAnimeData) => (getLastWatchedEpisode((b.media.id ?? (b.media.mediaListEntry && b.media.mediaListEntry.id)) as number)?.timestamp ?? 0) - (getLastWatchedEpisode((a.media.id ?? (a.media.mediaListEntry && a.media.mediaListEntry.id)) as number)?.timestamp ?? 0);

    if(logged) {
      const id = (viewerId as number) || await getViewerId();

      const current = await getViewerList(id, 'CURRENT');
      const rewatching = await getViewerList(id, 'REPEATING');

      result = result.concat(current.concat(rewatching));
    } else if(historyAvailable) {
      setHasHistory(true);
      result = Object.values(entries).map((value) => value.data).sort(sortNewest);
      setCurrentListAnime(result);
      return;
    }

    if(result.length === 0 && historyAvailable) {
      setHasHistory(true);
      result = Object.values(entries).map((value) => value.data).sort(sortNewest);

      setCurrentListAnime(result);
      return;
    }

    if(historyAvailable) {
      result = Object.values(result).sort(sortNewest);
    }

    console.log(entries, result);

    setCurrentListAnime(result);
  }

  useEffect(() => {
      const updateSectionListener = async (event: IpcRendererEvent, ...sections: string[]) => {
        for(const section of sections) {
          switch(section) {
            case 'history':
              await updateHistory();
              continue;
          }
        }
      }

      ipcRenderer.on('update-section', updateSectionListener);

      return () => {
          ipcRenderer.removeListener('update-section', updateSectionListener);
      };
  });

  ipcRenderer.on('auto-update', async () => {
    setShowDonateModal(false);
    setShowUpdateModal(true);
  });

  const fetchTab1AnimeData = async () => {
    try {
      var id = null;

      if (logged) {
        id = await getViewerId();
        setViewerId(id);

        setUserInfo(await getViewerInfo(id));
      }

      updateHistory();

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
      }
    } catch (error) {
      console.log('Tab2 error: ' + error);
    }
  };

  return (
    <AuthContext.Provider value={logged || hasHistory}>
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
          <DonateModal
            show={showDonateModal}
            onClose={() => {
              setShowDonateModal(false);
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
              {logged && (
                <Route
                  path="/tab2"
                  element={
                    <Tab2
                      currentListAnime={currentListAnime}
                      planningListAnime={planningListAnime}
                      // completedListAnime={completedListAnime}
                      // droppedListAnime={droppedListAnime}
                      // pausedListAnime={pausedListAnime}
                      // repeatingListAnime={RepeatingListAnime}
                      clicked={() => {
                        !tab2Click && setTab2Click(true);
                      }}
                    />
                  }
                />
              )}
              {!logged && hasHistory && (
                <Route
                  path="/tab2"
                  element={
                    <Tab2
                      currentListAnime={currentListAnime}
                      clicked={() => {
                        !tab2Click && setTab2Click(true);
                      }}
                    />
                  }
                />
              )}
              <Route path="/tab3" element={<Tab3 />} />
              <Route path="/tab4" element={<Tab4 />} />
              <Route
                path="/tab5"
                element={
                  <Tab5
                    viewerId={viewerId}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SkeletonTheme>
      </ViewerIdContext.Provider>
    </AuthContext.Provider>
  );
}
