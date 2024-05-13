import { ListAnimeData } from "../../types/anilistAPITypes"
import { getEpisodeUrl as animesaturn } from './animesaturn';
import { getEpisodeUrl as gogoanime } from './gogoanime';
import { getParsedAnimeTitles } from "../utils";
import Store from 'electron-store'
import { IVideo } from "@consumet/extensions";

const STORE = new Store()

/**
 * Gets the episode url and isM3U8 flag, with stored language and dubbed
 * 
 * @param listAnimeData 
 * @param episode 
 * @returns 
 */
export const getUniversalEpisodeUrl = async (listAnimeData: ListAnimeData, episode: number): Promise<IVideo | null> => {
  const lang = (await STORE.get('source_flag')) as string;
  const dubbed = (await STORE.get('dubbed')) as boolean;
  const animeTitles = getParsedAnimeTitles(listAnimeData.media);

  switch (lang) {
    case 'US': {
      const data = await gogoanime(animeTitles, episode, dubbed)
      return data;
    }
    case 'IT': {
      const data = await animesaturn(animeTitles, episode, dubbed)
      return data;
    }
  }

  return null
}
