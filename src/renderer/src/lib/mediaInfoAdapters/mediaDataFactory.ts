import { MediaDataSource, MediaProvider } from '@renderer/models/media';

import { AniListAdapter } from './anilistAdapter';

export const getMediaDataSource = (source: MediaProvider): MediaDataSource => {
  switch (source) {
    case "anilist":
      return AniListAdapter;
    default:
      throw new Error("Wrong source");
  }
};