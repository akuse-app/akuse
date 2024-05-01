import { Media, PageInfo } from "./anilistGraphQLTypes"

export type TrendingAnime = {
  media?: [Media]
  pageInfo?: PageInfo
}
