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
  const [newAnime, setNewAnime] = useState<ListAnimeData[]>();
  const [bookmarkAnime, setBookmarkAnime] = useState<ListAnimeData[]>();

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

  useEffect(() => {
    const updateSectionListener = async (event: IpcRendererEvent, ...sections: string[]) => {
      for(const section of sections) {
        switch(section) {
          case 'history':
            const currentList = Object.values(getHistoryEntries()).map((value) => value.data).sort((a, b) =>
              (getLastWatchedEpisode((b.id || b.media.mediaListEntry && b.media.mediaListEntry.id || b.media.id) as number)?.timestamp ?? 0) - (getLastWatchedEpisode((a.id || a.media.mediaListEntry && a.media.mediaListEntry.id || a.media.id) as number)?.timestamp ?? 0)
            );
            setCurrentListAnime(currentList);
            break;
          case 'new':
            setNewAnime(await getAnimesFromTitles((await getRecentEpisodes()).results.map((episode) => {
              return episode.title as string;
            })));
            break;
          case 'bookmark':
            const id = await getViewerId();
            setViewerId(id);

            setUserInfo(await getViewerInfo(id));
            const current = await getViewerList(id, 'CURRENT');
            const rewatching = await getViewerList(id, 'REPEATING');
            const planning = await getViewerList(id, 'PLANNING');

            setBookmarkAnime(current.concat(rewatching).concat(planning));

            break;
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
      const entries = getHistoryEntries();

      if (logged) {
        id = await getViewerId();
        setViewerId(id);

        setUserInfo(await getViewerInfo(id));
        const current = await getViewerList(id, 'CURRENT');
        const rewatching = await getViewerList(id, 'REPEATING');
        const planning = await getViewerList(id, 'PLANNING');

        setBookmarkAnime(current.concat(rewatching).concat(planning));
      }
      // airingSchedule.airingSchedules.forEach((value) => {
        // console.log(value.media.title.userPreferred, value.airingAt - Date.now() / 1000);
      // })

      if(Object.values(entries).length > 0) {
        setHasHistory(true);
        const currentList = Object.values(entries).map((value) => value.data).sort((a, b) =>
          (getLastWatchedEpisode((b.id || b.media.mediaListEntry && b.media.mediaListEntry.id || b.media.id) as number)?.timestamp ?? 0) - (getLastWatchedEpisode((a.id || a.media.mediaListEntry && a.media.mediaListEntry.id || a.media.id) as number)?.timestamp ?? 0)
        )
        setCurrentListAnime(currentList);
      }

      setTrendingAnime(animeDataToListAnimeData(await getTrendingAnime(id)));
      setMostPopularAnime(
        animeDataToListAnimeData(await getMostPopularAnime(id)),
      );
      setNextReleasesAnime(animeDataToListAnimeData(await getNextReleases(id)));
      setNewAnime(airingDataToListAnimeData(await getAiredAnime(id)));
      // setNewAnime(await getAnimesFromTitles((await getRecentEpisodes()).results.map((episode) => {
      //   return episode.title as string;
      // })));
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
                    newAnime={newAnime}
                    bookmarkAnime={bookmarkAnime}
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
            </Routes>
          </MemoryRouter>
        </SkeletonTheme>
      </ViewerIdContext.Provider>
    </AuthContext.Provider>
  );
}
