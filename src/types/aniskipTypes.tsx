export const SkipEventTypes = {
  Intro: 'op',
  Outro: 'ed',
  Recap: 'recap'
}

export type SkipEventType = typeof SkipEventTypes[keyof typeof SkipEventTypes];

export interface SkipEvent {
  episodeLength: number,
  interval: {
    startTime: number,
    endTime: number,
  },
  skipId: string,
  skipType: SkipEventType
}

