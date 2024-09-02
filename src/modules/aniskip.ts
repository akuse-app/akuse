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
    skipEvents: SkipEvent[]
  ) {
    if(!skipEvents || skipEvents.length === 0)
      return;

    for(const skipEvent of skipEvents) {
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
