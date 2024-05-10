import { IVideo } from '@consumet/extensions';
import AnimeSaturn from '@consumet/extensions/dist/providers/anime/animesaturn';

const consumet = new AnimeSaturn();

/**
 * Gets the episode url and isM3U8 flag
 *
 * @param {*} animeTitles array of anime titles
 * @param {*} episode anime episode to look for
 * @param {*} dubbed dubbed version or not
 * @returns consumet IVideo if url is found, otherwise null
 */
export const getEpisodeUrl = async (
  // animeSearch: string,
  animeTitles: string[],
  episode: number,
  dubbed: boolean,
): Promise<IVideo | null> => {
  animeTitles.forEach(async (animeSearch) => {
    const animeId = await getAnimeId(
      dubbed ? `${animeSearch} (ITA)` : animeSearch,
    );

    if (animeId) {
      const animeEpisodeId = await getAnimeEpisodeId(animeId, episode);
      if (animeEpisodeId) {
        const data = await consumet.fetchEpisodeSources(animeEpisodeId);
        return data.sources[1]; // [1] is streamtape
      }
    }
  });

  return null;
};

/**
 * Gets the anime id
 *
 * @param {*} animeSearch
 * @returns anime id if found, otherwise null
 */
export const getAnimeId = async (
  animeSearch: string,
): Promise<string | null> => {
  const data = await consumet.search(animeSearch);
  return data.results[0]?.id ?? null;
};

/**
 * Gets the anime episode id
 *
 * @param {*} animeId
 * @param {*} episode
 * @returns anime episode id if found, otherwise null
 */
export const getAnimeEpisodeId = async (
  animeId: string,
  episode: number,
): Promise<string | null> => {
  const data = await consumet.fetchAnimeInfo(animeId);
  return data?.episodes?.[episode - 1]?.id ?? null;
};
