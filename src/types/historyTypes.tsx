import { ListAnimeData } from "./anilistAPITypes"
import { EpisodeInfo } from "./types"

export interface EpisodeHistoryEntry {
  time: number
  timestamp: number
  duration?: number
  data: EpisodeInfo
}

export interface EpisodeHistoryEntries {
  [episodeNumber: number]: EpisodeHistoryEntry
}

export interface AnimeHistoryEntry {
  history: EpisodeHistoryEntries
  data: ListAnimeData
}

export interface HistoryEntries {
  [animeId: number]: AnimeHistoryEntry
}
export interface History {
  entries: HistoryEntries
}
