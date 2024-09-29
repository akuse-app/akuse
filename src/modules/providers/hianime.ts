import { load } from 'cheerio';
import { IVideo, IAnimeResult } from '@consumet/extensions';
import axios from 'axios';
import ProviderCache from './cache';

interface QueryResult {
  currentPage: number,
  hasNextPage: boolean,
  results: IAnimeResult[]
}

export interface SubtitleTrack {
  default?: boolean,
  file: string,
  kind: string,
  label: string
};

export default class HiAnime {
  baseUrl = 'https://hianime.to';
  ajaxUrl = `${this.baseUrl}/ajax`;
  vercelUrl = 'https://aniwatch-api-dusky.vercel.app';
  cache = new ProviderCache();
  search: any;
  query: (
    query: string,
    page: number,
  ) => Promise<QueryResult | undefined>;
  getEpisodeUrl: (
    animeTitles: string[],
    index: number,
    episode: number,
    dubbed: boolean,
  ) => Promise<IVideo[] | null>;

  constructor() {
    this.query = async function(query: string, page: number = 1) {
      const searchResult = {
        currentPage: page,
        hasNextPage: false,
        results: [] as IAnimeResult[],
      };

      const response = await axios.get(
        `${this.baseUrl}/search?keyword=${encodeURIComponent(query)}&page=${page}`
      );
      const $ = load(response.data);

      searchResult.hasNextPage = $('.page-item').next().length > 1;
      $('.flw-item').each((i, elm) => {
        const posterHref = $(elm).find('.film-poster-ahref');
        const posterImg = $(elm).find('.film-poster-img');

        searchResult.results.push({
          id: posterHref.attr('data-id') as string,
          title: posterImg.attr('alt') as string,
          url: `${this.baseUrl}${posterHref.attr('href')}`,
          image: posterImg.attr('data-src'),
        })
      })

      if(searchResult.results.length === 0)
        return;

      return searchResult;
    }

    this.getEpisodeUrl = async function(
      animeTitles: string[],
      index: number,
      episode: number,
      dubbed: boolean,
    ) {
      let animeId: string | undefined;

      for (const animeSearch of animeTitles) {
        if(this.cache.animeIds[animeSearch]) {
          animeId = this.cache.animeIds[animeSearch]
          break;
        }
        const animeInfo = await this.query(animeSearch, 1);

        if(animeInfo && animeInfo.results.length > 0) {
          animeId = (
            this.cache.animeIds[animeSearch] = animeInfo.results[index].id
          )
          break;
        }
      }

      if(!animeId)
        return null;

      const cacheId = `${animeId}-${episode}`;
      if(this.cache.search[cacheId] !== undefined)
        return this.cache.search[cacheId];

      let episodes = this.cache.episodes[animeId] ?? [];

      if(episodes.length === 0) {
        const episodeResponse = await axios.get(
          `${this.ajaxUrl}/v2/episode/list/${animeId}`
        );

        const $ = load(episodeResponse.data.html);

        $('.ep-item').each((i, elm) => {
          const element = $(elm);
          episodes.push({
            id: element.attr('data-id') as string,
            number: parseInt(element.attr('data-number') as string)
          })
        });

        this.cache.episodes[animeId] = episodes;
      }

      const episodeData = episodes.find(value => value.number === episode);
      console.log('episode data',episodeData);
      const episodeInfo = await axios.get(
        `${this.vercelUrl}/anime/episode-srcs?id=${animeId}?ep=${episodeData?.id}&server=hd-1&category=${dubbed ? 'dub' : 'sub'}`
      );

      return (
        this.cache.search[cacheId] = (episodeInfo.data.sources as IVideo[]).map((value) => {
            value.tracks = episodeInfo.data.tracks;
            value.skipEvents = {
              intro: episodeInfo.data.intro,
              outro: episodeInfo.data.outro
            };

            return value;
        }) ?? null
      )
    }
  }
};
