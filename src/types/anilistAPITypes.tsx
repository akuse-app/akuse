import { Media, PageInfo } from "./anilistGraphQLTypes"

export type AnimeData = {
  media?: Media[]
  pageInfo?: PageInfo
}

export type TrendingAnime = AnimeData
export type MostPopularAnime = AnimeData
