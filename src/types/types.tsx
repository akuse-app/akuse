export type EpisodeInfo = {
  image?: string;
  title?: {
    en?: string
  }
  summary?: string
  airdate?: string
  length?: string | number
  episodeNumber?: number
};

export type ClientData = {
  clientId: number;
  redirectUri: string;
  clientSecret: string;
};
