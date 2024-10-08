import '..//styles/components.css';
import '../styles/animations.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { ipcRenderer, IpcRendererEvent } from 'electron';
import Store from 'electron-store';
import { createContext, useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  getAnimeInfo,
  getMostPopularAnime,
  getTrendingAnime,
  getViewerId,
  getViewerInfo,
  getViewerList,
  getViewerLists,
} from '../modules/anilist/anilistApi';
import { getAnimeHistory, getHistoryEntries, getLastWatchedEpisode, setAnimeHistory } from '../modules/history';
import { OS } from '../modules/os';
import { setDefaultStoreVariables } from '../modules/storeVariables';
import { animeDataToListAnimeData } from '../modules/utils';
import { ListAnimeData, UserInfo } from '../types/anilistAPITypes';
import AutoUpdateModal from './components/modals/AutoUpdateModal';
import DonateModal from './components/modals/DonateModal';
import MainNavbar from './MainNavbar';
import Tab1 from './tabs/Tab1';
import Tab2 from './tabs/Tab2';
import Tab3 from './tabs/Tab3';
import Tab4 from './tabs/Tab4';
import Tab5 from './tabs/Tab5';
import WindowControls from './WindowControls';

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
  // const [nextReleasesAnime, setNextReleasesAnime] = useState<ListAnimeData[]>();
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
      result = await getViewerLists(id, 'CURRENT', 'REPEATING', 'PAUSED');
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

    if(historyAvailable)
      result = Object.values(result).sort(sortNewest);

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

      const autoUpdateListener = async () => {
        setShowDonateModal(false);
        setShowUpdateModal(true);
      }

      ipcRenderer.on('update-section', updateSectionListener);
      ipcRenderer.on('auto-update', autoUpdateListener);

      return () => {
          ipcRenderer.removeListener('update-section', updateSectionListener);
          ipcRenderer.removeListener('auto-update', autoUpdateListener);
      };
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
      // setNextReleasesAnime(animeDataToListAnimeData(await getNextReleases(id)));
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
                    // nextReleasesAnime={nextReleasesAnime}
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
                        if(tab2Click) return
                        setTab2Click(true);
                        fetchTab2AnimeData();
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
                        if(tab2Click) return
                        setTab2Click(true);
                        fetchTab2AnimeData();
                      }}
                    />
                  }
                />
              )}
              <Route path="/tab3" element={<Tab3 />} />
              <Route path="/tab4" element={
                <Tab4
                  viewerId={viewerId}
                />
              } />
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
