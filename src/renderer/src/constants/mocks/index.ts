import { MediaData } from '@/models/media';

export const MEDIA_MOCK: MediaData = {
  provider: 'anilist',
  id: 183133,
  title: 'The Unaware Atelier Master',
  titles: {
    romaji: 'Kanchigai no Atelier Meister',
    english: 'The Unaware Atelier Master',
    native: '勘違いのアトリエマイスター',
  },
  synonyms: ['Kanchigai no Atelier Meister'],
  coverImage: {
    extraLarge: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx183133-abc123.jpg',
    large: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx183133-abc123.jpg',
    medium: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx183133-abc123.jpg',
  },
  bannerImage: {
    extraLarge: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/183133-yGgdKRUyCMMv.jpg',
  },
  color: '#FFB3C6',
  startDate: {
    year: 2025,
    month: 4,
    day: 6,
  },
  genres: ['Fantasy', 'Adventure'],
  description: 'Kurt, un ragazzo gentile, viene improvvisamente cacciato dal gruppo degli eroi perché considerato "inutile". Scopre che, sebbene le sue abilità di combattimento siano scarse, possiede talenti straordinari in altre aree come la cucina, la costruzione e la creazione di strumenti magici. Inconsapevole delle sue capacità, finisce per salvare persone, città e persino il paese attraverso le sue azioni.',
  status: "RELEASING",
  format: "TV",
  rating: 0,
  duration: 24,
  episodes: 12,
  availableEpisodes: 0,
  mediaListEntry: undefined,
  recommendations: [],
  episodesCovers: null,
};
