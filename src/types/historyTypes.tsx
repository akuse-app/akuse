import { ListAnimeData } from "./anilistAPITypes"
import { EpisodeInfo } from "./types"

export interface EpisodeHistoryEntry {
  time: number
  timestamp: number
  duration: number | undefined
  data: EpisodeInfo
}

export interface AnimeHistoryEntry {
  history: { [key: number]: EpisodeHistoryEntry}
  data: ListAnimeData
}
export interface History {
  entries: { [key: number]: AnimeHistoryEntry}
}
