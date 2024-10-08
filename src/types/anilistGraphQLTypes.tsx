import internal from "node:stream";

export type MediaTitle = {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
};

export type MediaFormat =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC'
  | 'MANGA'
  | 'NOVEL'
  | 'ONE_SHOT'
  // Lazy related stuff
  | 'SEQUEL'
  | 'PREQUEL'
  | 'ALTERNATIVE'
  | 'SIDE_STORY'
  | 'CHARACTER'
  | 'SUMMARY'

export type MediaStatus =
  | 'FINISHED'
  | 'RELEASING'
  | 'NOT_YET_RELEASED'
  | 'CANCELLED'
  | 'HIATUS'

export type FuzzyDate = {
  year?: number;
  month?: number;
  day?: number;
};

export type MediaSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'

export type MediaCoverImage = {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
};

export type AiringPage = {
  airingSchedules: AiringSchedule[]
  pageInfo: PageInfo
}

export type AiringSchedule = {
  id: number;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  mediaId: number;
  media?: Media;
};

export type MediaListStatus =
  | 'CURRENT'
  | 'PLANNING'
  | 'COMPLETED'
  | 'DROPPED'
  | 'PAUSED'
  | 'REPEATING'

export type MediaList = {
  id: number;
  mediaId: number;
  status?: MediaListStatus;
  score?: number;
  progress?: number;
};

export type MediaTrailer = {
  id?: string;
  site?: string;
  thumbnail?: string;
};

export type PageInfo = {
  total: number;
  currentPage: number;
  hasNextPage: boolean;
};

export const RelationTypes = {
  Source: 'SOURCE',
  Alternative: 'ALTERNATIVE',
  Other: 'OTHER',
  Prequel: 'PREQUEL',
  Sequel: 'SEQUEL',
  Character: 'CHARACTER',
  SideStory: 'SIDE_STORY',
  Parent: 'PARENT',
  Adaptation: 'ADAPTATION',
  SpinOff: 'SPIN_OFF',
  Compilation: 'COMPILATION',
  Contains: 'CONTAINS'
};

export type RelationType = typeof RelationTypes[keyof typeof RelationTypes];

export type Relation = {
  id: number;
  relationType: RelationType;
  node: Media;
};

export type RelationConnection = {
  edges: Relation[];
};

export type Recommend = {
  id: number;
  mediaRecommendation: Media;
};

export type RecommendConnection = {
  nodes: Recommend[];
}

export const MediaTypes = {
  Anime: 'ANIME',
  Manga: 'MANGA'
};

export type MediaType = typeof MediaTypes[keyof typeof MediaTypes];

export type Media = {
  id?: number;
  type?: MediaType;
  idMal?: number;
  title?: MediaTitle;
  format?: MediaFormat;
  status?: MediaStatus;
  description?: string;
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  season?: MediaSeason;
  seasonYear?: number;
  episodes: number;
  duration?: number;
  coverImage?: MediaCoverImage;
  bannerImage?: string;
  genres?: string[];
  synonyms?: string[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favourites?: number;
  isAdult?: boolean;
  nextAiringEpisode?: AiringSchedule;
  mediaListEntry?: MediaList;
  siteUrl?: string;
  trailer?: MediaTrailer;
  relations?: RelationConnection;
  recommendations?: RecommendConnection;
};
