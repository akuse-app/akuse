import { Media, PageInfo } from "./anilistGraphQLTypes"

export type AnimeData = {
  media?: Media[]
  pageInfo?: PageInfo
}

export type ListAnimeData = {
  id: number | null
  mediaId: number | null
  progress?: number | null
  media: Media
}

export type TrendingAnime = AnimeData
export type MostPopularAnime = AnimeData
export type CurrentListAnime = ListAnimeData[]
