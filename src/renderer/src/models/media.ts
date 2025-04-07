import {
  FuzzyDate,
  Media,
  MediaFormat,
  MediaList,
  MediaListStatus,
  MediaStatus,
  MediaTitle,
  UserLists,
} from "./anilist";

export interface MediaDataSource {
  /**
   * convert fetched media to MediaData
   *
   * @param rawMedia
   * @returns MediaData
   */
  convert: (rawMedia: Media) => MediaData;
  /**
   * convert fetched media array to MediaData array
   *
   * @param rawMediaList
   * @returns MediaData[]
   */
  convertList: (rawMediaList: Media[]) => MediaData[];
  /**
   * convert fetched user lists array to UserMediaLists
   *
   * @param rawMediaList
   * @returns UserMediaLists
   */
  convertUserLists: (rawUserMediaLists: UserLists) => UserMediaLists;
  /**
   *
   * @param rawMedia
   * @returns whether to show "New episode" tag on the card
   */
  hasNewEpisode: (rawMedia: any) => boolean;
  fetchEpisodesCovers: (
    ...args: any
  ) => Promise<Record<string, Record<string, MediaEpisodeCover>> | null>;
  getMediaEpisodes: (media: MediaData) => any[];
  // getMediaEpisodesListOptions: (media: MediaData) => Options;
}

export type MediaProvider = "anilist" | "onepace";

export type UserMediaLists = Partial<Record<MediaListStatus, MediaData[]>>;

export type MediaImage = {
  extraLarge?: string;
  large?: string;
  medium?: string;
};

export interface MediaData {
  id: string | number;
  provider: MediaProvider;
  title: string;
  titles?: MediaTitle;
  synonyms?: string[];
  coverImage?: MediaImage;
  bannerImage?: MediaImage;
  color?: string;
  startDate?: FuzzyDate;
  genres?: string[];
  description?: string;
  status?: MediaStatus;
  format?: MediaFormat;
  rating?: number;
  duration?: number;
  episodes?: number;
  availableEpisodes?: number;
  mediaListEntry?: MediaList;
  recommendations?: MediaData[];

  /**
   * {
   *   season-1-id:
   *    1:
   *      ...episodeCover
   *    2:
   *      ...episodeCover
   *   season-2-id:
   * }
   *
   * for anilist media, season is always 1
   */
  episodesCovers?: Record<string, Record<string, MediaEpisodeCover>> | null;
}

export interface MediaEpisodeCover {
  image?: string;
  title?: string;
  summary?: string;
  airdate?: string;
  length?: string | number;
  episodeNumber?: number;
}