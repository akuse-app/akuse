import { deleteAnimeFromList, updateAnimeFromList } from './anilist'
import { MediaData } from '@renderer/models/media'

export const addMediaToLibrary = async (setUserLists: any, media: MediaData): Promise<boolean> => {
  const mediaList = await updateAnimeFromList(media.id, 'PLANNING')

  if (mediaList !== null) {
    media.mediaListEntry = mediaList

    setUserLists((prevLists: any) => ({
      ...prevLists,
      PLANNING: prevLists?.PLANNING ? [media, ...prevLists.PLANNING] : [media]
    }))

    return true
  } else {
    alert('Error adding to library')
    return false
  }
}

export const removeMediaFromLibrary = async (setUserLists: any, media: MediaData) => {
  const oldList = media.mediaListEntry?.status
  if (oldList === undefined) return false

  const deleted = await deleteAnimeFromList(media.mediaListEntry?.id)
  if (deleted) {
    media.mediaListEntry = undefined

    setUserLists((prevLists: any) => ({
      ...prevLists,
      [oldList]: prevLists?.[oldList]
        ? prevLists[oldList].filter((item: any) => item.id !== media.id)
        : []
    }))

    return true
  } else {
    alert('Error deleting from library')
    return false
  }
}

export const markAnimeAsWatchingOrRewatching = async (media: MediaData, setUserLists: any) => {
  const oldList = media.mediaListEntry?.status

  // no need to update list if media is already there
  if (oldList === 'CURRENT' || oldList === 'REPEATING') return

  // put in repeating if was in completed before,
  // otherwise put in current
  const newList = oldList === 'COMPLETED' ? 'REPEATING' : 'CURRENT'

  const mediaList = await updateAnimeFromList(media.id, newList, undefined, 0)

  if (mediaList !== null) {
    media.mediaListEntry = mediaList

    moveMedia(setUserLists, newList, media)

    console.info(`Marked ${media.id} as ${newList}`)

    return true
  } else {
    alert('Error marking as watching/rewatching')
    return false
  }
}

export const updateAnimeProgress = async (
  media: MediaData,
  setUserLists: any,
  progress: number
) => {
  const list = media.mediaListEntry?.status
  if (list === undefined) return false

  const mediaList = await updateAnimeFromList(media.id, undefined, undefined, progress)

  if (mediaList !== null) {
    media.mediaListEntry = mediaList

    updateMedia(setUserLists, list, media)

    return true
  } else {
    alert('Error updating progress')
    return false
  }
}

/**
 * moves a media from a list to another
 *
 * @param setUserLists
 * @param to
 * @param media
 */
const moveMedia = (setUserLists: any, to: string, media: MediaData) => {
  setUserLists((prevLists: any) => {
    const currentListName = Object.keys(prevLists).find((listName) =>
      prevLists[listName]?.some((item: any) => item.id === media.id)
    )

    const updatedLists = { ...prevLists }

    if (currentListName) {
      updatedLists[currentListName] = updatedLists[currentListName].filter(
        (item: any) => item.id !== media.id
      )
    }

    const destinationList = updatedLists[to] || []
    updatedLists[to] = [media, ...destinationList]

    return updatedLists
  })
}

const updateMedia = (setUserLists: any, list: string, updatedMedia: MediaData) => {
  setUserLists((prevLists: any) => ({
    ...prevLists,
    [list]: prevLists[list]?.some((item: any) => item.id === updatedMedia.id)
      ? prevLists[list].map((item: any) => (item.id === updatedMedia.id ? updatedMedia : item))
      : [...(prevLists[list] || []), updatedMedia]
  }))
}
