import { skip } from "node:test";
import { SkipEvent, SkipEventTypes } from "../types/aniskipTypes";
import { makeRequest } from "./requests";

const AniSkip = {
  baseUrl: "https://api.aniskip.com/",
  getSkipEvents: async function(
    malId: number,
    episodeNumber: number,
    episodeLength: number = 0
  ) {
    try {
      const data = await makeRequest('GET', `${this.baseUrl}v2/skip-times/${malId}/${episodeNumber}?types=op&types=ed&types=recap&episodeLength=${Math.floor(episodeLength)}`);

      if(!data.found)
        return [];

      return data.results as SkipEvent[];
    } catch {
      return [];
    }
  },
  getCurrentEvent: function(
    time: number,
    skipEvents: SkipEvent[],
    videoDuration: number = 0
  ) {
    if(!skipEvents || skipEvents.length === 0)
      return;

    for(const skipEvent of skipEvents) {
      if(!skipEvent.interval.offsetApplied) {
        const offset = skipEvent.episodeLength - videoDuration;
        skipEvent.interval.endTime = Math.max(offset + skipEvent.interval.endTime, 0);
        skipEvent.interval.startTime = Math.max(offset + skipEvent.interval.startTime, 0);
        skipEvent.interval.offsetApplied = true;
      }

      const interval = skipEvent.interval;

      if(interval.startTime <= time && interval.endTime > time)
        return skipEvent
    }
  },
  getEventName: function(
    skipEvent: SkipEvent
  ) {
    for(const [name, value] of Object.entries(SkipEventTypes)) {
      if(value !== skipEvent.skipType)
        continue;

      return name;
    }
  }
}


export default AniSkip;
