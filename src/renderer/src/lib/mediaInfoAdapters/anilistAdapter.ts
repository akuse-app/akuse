import { Media, MediaListStatus, UserLists } from '@/models/anilist'
import { AnimeDBInfo } from '@renderer/models/anizip'
import {
  MediaData,
  MediaDataSource,
  MediaEpisodeCover,
  UserMediaLists
} from '@renderer/models/media'
import axios from 'axios'

import { getAvailableEpisodes, getEpisodes, getTitle } from '@renderer/lib/anilistUtils'

export const AniListAdapter: MediaDataSource = {
  convert: (rawMedia: Media): MediaData => {
    return {
      id: rawMedia.id,
      provider: 'anilist',
      title: getTitle(rawMedia),
      titles: rawMedia.title,
      synonyms: rawMedia.synonyms,
      coverImage: rawMedia.coverImage,
      bannerImage: {
        extraLarge: rawMedia.bannerImage
      },
      color: rawMedia.coverImage?.color,
      startDate: rawMedia.startDate,
      genres: rawMedia.genres,
      description: rawMedia.description,
      status: rawMedia.status,
      format: rawMedia.format,
      rating: rawMedia.meanScore,
      duration: rawMedia.duration,
      episodes: getEpisodes(rawMedia),
      availableEpisodes: getAvailableEpisodes(rawMedia),
      mediaListEntry: rawMedia.mediaListEntry,
      recommendations: AniListAdapter.convertList(
        rawMedia?.recommendations?.nodes
          ?.flatMap((n) => n.mediaRecommendation)
          .filter((media) => media !== null) || []
      )
    }
  },

  convertList: (rawMediaList: Media[]): MediaData[] =>
    rawMediaList.map((r) => AniListAdapter.convert(r)),

  convertUserLists: (rawUserMediaLists: UserLists): UserMediaLists => {
    try {
      const convertedLists: UserMediaLists = {}

      for (const status in rawUserMediaLists) {
        const list = AniListAdapter.convertList(rawUserMediaLists[status as MediaListStatus] || [])

        convertedLists[status as MediaListStatus] = list
      }

      return convertedLists
    } catch (error) {
      console.log(error)
      return {}
    }
  },

  hasNewEpisode: (rawMedia: Media): boolean =>
    !!(rawMedia.mediaListEntry
      ? rawMedia.status === 'RELEASING' &&
        (rawMedia.mediaListEntry?.progress ?? 0) < (getAvailableEpisodes(rawMedia) ?? -1)
      : rawMedia.status === 'RELEASING'),

  fetchEpisodesCovers: async (
    id: string | number
  ): Promise<Record<string, Record<string, MediaEpisodeCover>> | null> => {
    try {
      const { data } = await axios.get<AnimeDBInfo>(`https://api.ani.zip/mappings?anilist_id=${id}`)
      if (!data?.episodes) return null

      const covers: Record<string, Record<string, MediaEpisodeCover>> = {
        1: {}
      }

      for (const [key, value] of Object.entries(data.episodes)) {
        covers[1][key] = {
          image: value.image,
          title: value?.title?.en,
          summary: value.summary,
          airdate: value.airdate,
          length: value.length,
          episodeNumber: value.episodeNumber
        }
      }

      return covers
    } catch {
      return null
    }
  },

  getMediaEpisodes: (media: MediaData) => {
    const episodesCount = media.availableEpisodes ?? 0

    return Array.from({ length: episodesCount }, (_, index) => ({
      number: index + 1,
      episodeCover: media?.episodesCovers?.[1]?.[index + 1]
    }))
  }

  // getMediaEpisodesListOptions: (media: MediaData): Options => {
  //   const episodesCount = media.availableEpisodes ?? 0;
  //   const totalPages: number = Math.ceil(episodesCount / EPISODES_PER_PAGE);

  //   const options: Options = Array.from({ length: totalPages }, (_, index) => {
  //     const start = index * EPISODES_PER_PAGE + 1;
  //     const end = Math.min((index + 1) * EPISODES_PER_PAGE, episodesCount);
  //     return {
  //       label: `${start} - ${end}`,
  //       value: index + 1,
  //     };
  //   });

  //   return options;
  // },
}
