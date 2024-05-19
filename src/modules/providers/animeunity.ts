import { IVideo } from '@consumet/extensions';
import AnimeUnity from '@consumet/extensions/dist/providers/anime/animeunity';

const consumet = new AnimeUnity();

/**
 *
 * @param animeTitles
 * @param episode
 * @param dubbed
 * @returns
 */
export const getEpisodeUrl = async (
  animeTitles: string[],
  episode: number,
  dubbed: boolean,
): Promise<IVideo[] | null> => {
  console.log(
    `%c Episode ${episode}, looking for AnimeUnity source...`,
    `color: #6b8cff`,
  );

  for (const animeSearch of animeTitles) {
    const result = await searchEpisodeUrl(animeSearch, episode, dubbed);
    if (result) {
      return result;
    }
  }

  return null;
};

/**
 * Gets the episode url and isM3U8 flag
 *
 * @param {*} animeSearch
 * @param {*} episode anime episode to look for
 * @param {*} dubbed dubbed version or not
 * @returns consumet IVideo if url is found, otherwise null
 */
async function searchEpisodeUrl(
  animeSearch: string,
  episode: number,
  dubbed: boolean,
): Promise<IVideo[] | null> {
  const animeId = await getAnimeId(
    dubbed ? `${animeSearch} (ITA)` : animeSearch,
  );

  if (animeId) {
    const animeEpisodeId = await getAnimeEpisodeId(animeId, episode);
    if (animeEpisodeId) {
      const data = await consumet.fetchEpisodeSources(animeEpisodeId);
      console.log(`%c ${animeSearch}`, `color: #45AD67`);

      console.log(data);

      return data.sources;
    }
  }

  console.log(`%c ${animeSearch}`, `color: #E5A639`);
  return null;
}

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
  const data = await consumet.fetchAnimeInfo(
    animeId,
    episode > 120 ? Math.floor(episode / 120) + 1 : 1,
  );
  return data?.episodes?.[episode % 120 - 1]?.id ?? null;
};
