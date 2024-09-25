import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getAnimeInfo,
  getMostPopularAnime,
  getNextReleases,
  getTrendingAnime,
  getViewerId,
  getViewerInfo,
  getViewerList,
  getViewerLists,
} from '../modules/anilist/anilistApi';

import { animeDataToListAnimeData } from '../modules/utils';
import { ListAnimeData, UserInfo } from '../types/anilistAPITypes';
import MainNavbar from './MainNavbar';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
import Tab3 from './tabs/Tab3';
import Tab4 from './tabs/Tab4';

import { setDefaultStoreVariables } from '../modules/storeVariables';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import AutoUpdateModal from './components/modals/AutoUpdateModal';
import WindowControls from './WindowControls';
import { OS } from '../modules/os';
import DonateModal from './components/modals/DonateModal';
import { getAnimeHistory, getHistoryEntries, getLastWatchedEpisode, setAnimeHistory } from '../modules/history';
import Tab5 from './tabs/Tab5';

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
  const [sectionUpdate, setSectionUpdate] = useState<boolean>(true);

  // tab1
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentListAnime, setCurrentListAnime] = useState<ListAnimeData[]>();
  const [trendingAnime, setTrendingAnime] = useState<ListAnimeData[]>();
  const [mostPopularAnime, setMostPopularAnime] = useState<ListAnimeData[]>();
  const [nextReleasesAnime, setNextReleasesAnime] = useState<ListAnimeData[]>();
  const [recommendedAnime, setRecommendedAnime] = useState<ListAnimeData[]>();
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

  const updateRecommended = async (history: ListAnimeData[]) => {
    const animeData = history[
      Math.floor(Math.random() * (history.length - 1))
    ];

    if(animeData.media.recommendations === undefined) {
      animeData.media = await getAnimeInfo(animeData.media.id);
      const entry = getAnimeHistory(animeData.media.id as number);
      if(entry) {
        entry.data = animeData;
        setAnimeHistory(entry);
      }
    }

    const recommendedList = animeData.media.recommendations?.nodes.map((value) => {
      return {
        id: null,
        mediaId: null,
        progress: null,
        media: value.mediaRecommendation
      } as ListAnimeData
    });

    recommendedList?.push(animeData);

    setRecommendedAnime(recommendedList);
  }

  const updateHistory = async () => {
    const entries = getHistoryEntries();
    const historyAvailable = Object.values(entries).length > 0;

    let result: ListAnimeData[] = [];
    const sortNewest = (a: ListAnimeData, b: ListAnimeData) => (getLastWatchedEpisode((b.media.id ?? (b.media.mediaListEntry && b.media.mediaListEntry.id)) as number)?.timestamp ?? 0) - (getLastWatchedEpisode((a.media.id ?? (a.media.mediaListEntry && a.media.mediaListEntry.id)) as number)?.timestamp ?? 0);

    if(logged) {
      const id = (viewerId as number) || await getViewerId();

      const history = await getViewerLists(id, 'watching', 'paused', 'completed');

      // console.log(history);

      // const current = await getViewerList(id, 'CURRENT');
      // const rewatching = await getViewerList(id, 'REPEATING');
      // const paused = await getViewerList(id, 'PAUSED');

      // console.log(current, rewatching, paused)

      result = result.concat(history);
    } else if(historyAvailable) {
      setHasHistory(true);
      result = Object.values(entries).map((value) => value.data).sort(sortNewest);
      setCurrentListAnime(result);
      updateRecommended(result);
      return;
    }

    if(result.length === 0 && historyAvailable) {
      setHasHistory(true);
      result = Object.values(entries).map((value) => value.data).sort(sortNewest);

      setCurrentListAnime(result);
      updateRecommended(result);
      return;
    }

    if(historyAvailable) {
      result = Object.values(result).sort(sortNewest);
    }

    setCurrentListAnime(result);
    updateRecommended(result);
  }

  useEffect(() => {
      const updateSectionListener = async (event: IpcRendererEvent, ...sections: string[]) => {
        if(sectionUpdate){
          setSectionUpdate(false);
          setTimeout(() => setSectionUpdate(true), 3000);
        } else return;

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
                    recommendedAnime={recommendedAnime}
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
