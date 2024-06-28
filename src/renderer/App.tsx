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
import SocketService from '../constants/socketserver';
import { getUniversalEpisodeUrl } from '../modules/providers/api';
import toast from 'react-hot-toast';
import { IVideo } from '@consumet/extensions';
import VideoPlayer from './components/player/VideoPlayer';
import { EpisodeInfo } from '../types/types';
import axios from 'axios';
import { EPISODES_INFO_URL } from '../constants/utils';

ipcRenderer.on('console-log', (event, toPrint) => {
  console.log(toPrint);
});

const store = new Store();
export const AuthContext = createContext<boolean>(false);
export const ViewerIdContext = createContext<number | null>(null);
const style = getComputedStyle(document.body);

let dataAnime : ListAnimeData = {} as ListAnimeData;


export default function App(){
  const [logged, setLogged] = useState<boolean>(store.get('logged') as boolean);
  const [viewerId, setViewerId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const [socketService, setSocketService] = useState<SocketService | null>(null);

  const [showPlayer, setShowPlayer] = useState<boolean>(false);
  const [playerIVideo, setPlayerIVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [animeEpisodeNumber, setAnimeEpisodeNumber] = useState<number>(0);  
  const [episodesInfo, setEpisodesInfo] = useState<EpisodeInfo[]>([] as EpisodeInfo[]);
  const [listAnimeData, setListAnimeData] = useState<ListAnimeData>({} as ListAnimeData);
  const [episode, setEpisode] = useState<number>(0);
  const [localProgress, setLocalProgress] = useState<number>(0);

  const fetchEpisodesInfo = async () => {
    console.log(dataAnime)
    if(dataAnime.media){
      axios.get(`${EPISODES_INFO_URL}${dataAnime.media.id}`).then((data) => {
        if (data.data && data.data.episodes) setEpisodesInfo(data.data.episodes);
      });
      return
    }else console.log(`dataAnime.media not found.`)
  };

  useEffect(() => {
    const socket = socketService?.getSocket();
  
    if (socket) {
      socket.on('loadEpisode', async (data: any) => {
        const { animeData, episode } = data;
  
        try {
          // Update state with animeData
          setListAnimeData(data.data);
          dataAnime = data.data as ListAnimeData;
          // Fetch episode info
          await fetchEpisodesInfo();
  
          // Set episode number and initialize player
          setEpisode(episode)

  
          // Fetch universal episode URL
          const urlData = await getUniversalEpisodeUrl(data.data, episode);
          
          if (!urlData) {
            toast(`Source not found.`, {
              style: {
                color: style.getPropertyValue('--font-2'),
                backgroundColor: style.getPropertyValue('--color-3'),
              },
              icon: '❌',
            });
            setLoading(false);
            return;
          }
          setAnimeEpisodeNumber(episode);
          setShowPlayer(true);
          setLoading(true);
          // Set player with video URL
          setPlayerIVideo(urlData);
        } catch (error) {
          console.error('Error handling loadEpisode event:', error);
          // Handle error if necessary
        }
      });
    }
  
    // Clean up event listener on component unmount
    return () => {
      socket?.off('loadEpisode');
    };
  }, [socketService]); // Ensure useEffect runs when socketService changes
  

  useEffect(() => {
    setSocketService(SocketService.getInstance("http://212.71.238.205:3000"))
  })

  

  setDefaultStoreVariables();

  ipcRenderer.on('auto-update', async () => {
    setShowUpdateModal(true);
  });

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

  // tab2
  const [tab2Click, setTab2Click] = useState<boolean>(false);
  const [planningListAnime, setPlanningListAnimeListAnime] = useState<
    ListAnimeData[] | undefined
  >(undefined);
  // const [completedListAnime, setCompletedListAnimeListAnime] = useState<
  //   ListAnimeData[] | undefined
  // >(undefined);
  // const [droppedListAnime, setDroppedListAnimeListAnime] = useState<
  //   ListAnimeData[] | undefined
  // >(undefined);
  // const [pausedListAnime, setPausedListAnimeListAnime] = useState<
  //   ListAnimeData[] | undefined
  // >(undefined);
  // const [RepeatingListAnime, setRepeatingListAnimeListAnime] = useState<
  //   ListAnimeData[] | undefined
  // >(undefined);

  const style = getComputedStyle(document.body);

  const handleLocalProgressChange = (localProgress: number) => {
    setLocalProgress(localProgress);
  };

  const handleChangeLoading = (value: boolean) => {
    setLoading(value);
  };

  const handlePlayerClose = () => {
    try {
      setShowPlayer(false);
    } catch (error) {
      console.log(error);
    }
  };


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

  const fetchTab2AnimeData = async () => {
    try {
      if (viewerId) {
        setPlanningListAnimeListAnime(
          await getViewerList(viewerId, 'PLANNING'),
        );
        // setCompletedListAnimeListAnime(
        //   await getViewerList(viewerId, 'COMPLETED'),
        // );
        // setDroppedListAnimeListAnime(await getViewerList(viewerId, 'DROPPED'));
        // setPausedListAnimeListAnime(await getViewerList(viewerId, 'PAUSED'));
        // setRepeatingListAnimeListAnime(
        //   await getViewerList(viewerId, 'REPEATING'),
        // );
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
    <>
      {showPlayer && listAnimeData && (
        <VideoPlayer
          video={playerIVideo}
          listAnimeData={listAnimeData}
          episodesInfo={episodesInfo}
          animeEpisodeNumber={animeEpisodeNumber}
          show={showPlayer}
          loading={loading}
          onLocalProgressChange={handleLocalProgressChange}
          onChangeLoading={handleChangeLoading}
          onClose={handlePlayerClose}
        />
      )}
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
              <Route path="/tab3" element={<Tab3 />} />
              <Route path="/tab4" element={<Tab4 />} />
            </Routes>
          </MemoryRouter>
        </SkeletonTheme>
      </ViewerIdContext.Provider>
    </AuthContext.Provider>
    </>
  );
}
