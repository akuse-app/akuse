export type EpisodeDBInfo = {
  image?: string;
  title?: {
    en?: string;
  };
  summary?: string;
  airdate?: string;
  length?: string | number;
  episodeNumber?: number;
  episode?: string;
};

export type AnimeDBInfo = {
  episodes?: {
    [index: string]: EpisodeDBInfo;
  };
  [other: string]: any;
};

export type AnimeDBInfoContext = Record<string, AnimeDBInfo | null>