import { Media, MediaListCollection, UserLists } from "@/models/anilist";
// import { getRawStoreItem } from "./store";

export const getHeaders = async () => {
  // const accessToken = await getRawStoreItem("access_token");

  const accessToken = null

  if (accessToken === null)
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

  return {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const getTitle = (media: Media | undefined): string => {
  return (
    media?.title?.english || media?.title?.romaji || media?.title?.native || ""
  );
};

export const getEpisodes = (media: Media): number | undefined => {
  if (media.episodes != null) {
    return media.episodes;
  }

  if (media.nextAiringEpisode != null) {
    return media.nextAiringEpisode.episode - 1;
  }

  return undefined;
};

export const getAvailableEpisodes = (animeEntry: Media): number | undefined => {
  if (animeEntry.nextAiringEpisode != null) {
    return animeEntry.nextAiringEpisode.episode - 1;
  }

  if (animeEntry.episodes != null) {
    return animeEntry.episodes;
  }

  if (
    animeEntry.airingSchedule?.edges &&
    animeEntry.airingSchedule.edges[0]?.node?.episode
  ) {
    return animeEntry.airingSchedule.edges[0].node.episode;
  }

  return undefined;
};

export const convertToUserList = (
  lists: MediaListCollection["lists"]
): UserLists => {
  return lists!.reduce((acc, list) => {
    if (list?.entries && list.status) {
      acc[list.status] = list.entries.flatMap(
        (entry) => entry.media ?? ({} as Media)
      );
    }
    return acc;
  }, {} as UserLists);
};