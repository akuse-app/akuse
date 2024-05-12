import { IVideo } from '@consumet/extensions';
import Gogoanime from '@consumet/extensions/dist/providers/anime/gogoanime';
const consumet = new Gogoanime();


export const getEpisodeUrl = async (
  animeTitles: string[],
  episode: number,
  dubbed: boolean,
): Promise<IVideo | null> => {
  console.log(
    `%c Episode ${episode}, looking for Gogoanime source...`,
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
 * @param {*} animeTitles array of anime titles
 * @param {*} episode anime episode to look for
 * @param {*} dubbed dubbed version or not
 * @returns consumet IVideo if url is found, otherwise null
 */
async function searchEpisodeUrl(
  animeSearch: string,
  episode: number,
  dubbed: boolean,
): Promise<IVideo | null> {
  const animeId = await getAnimeId(
    dubbed ? `${animeSearch} (Dub)` : animeSearch,
  );

  if (animeId) {
    const animeEpisodeId = await getAnimeEpisodeId(animeId, episode);
    if (animeEpisodeId) {
      const data = await consumet.fetchEpisodeSources(animeEpisodeId);

      for (let i = 0; i < Object.keys(data.sources).length; i++) {
        const source = data.sources[i];
        if (
          source.quality === '1080p' ||
          source.quality === '720p' ||
          source.quality === 'default'
        ) {
          console.log(`%c ${animeSearch}: ${source.quality} quality`, `color: #45AD67`);
          return source;
        }
      }

      console.log(`%c ${animeSearch}: default quality`, `color: #45AD67`);
      return data.sources[0];
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
  const data = await consumet.fetchAnimeInfo(animeId);
  return data?.episodes?.[episode - 1]?.id ?? null;
};
