import Store from 'electron-store';

export type StoreKeys =
  | 'logged'
  | 'access_token'
  | 'update_progress'
  | 'dubbed'
  | 'source_flag'
  | 'intro_skip_time'
  | 'show_duration'
  | 'trailer_volume_on';

export type StorageContextType = {
  logged: boolean;
  accessToken: string;
  updateProgress: boolean;
  watchDubbed: boolean;
  selectedLanguage: string;
  skipTime: number;
  showDuration: boolean;
  trailerVolumeOn: boolean;
  updateStorage: (key: StoreKeys, value: any) => Promise<void>;
};

export type LanguageOptions = 'IT' | 'US';

export const STORE_SCHEMA: Record<StoreKeys, any> = {
  logged: {
    type: 'boolean',
    default: false,
  },
  access_token: {
    type: 'string',
    default: '',
  },
  update_progress: {
    type: 'boolean',
    default: false,
  },
  dubbed: {
    type: 'boolean',
    default: false,
  },
  source_flag: {
    type: 'string',
    default: 'US',
  },
  intro_skip_time: {
    type: 'number',
    default: 85,
  },
  show_duration: {
    type: 'boolean',
    default: true,
  },
  trailer_volume_on: {
    type: 'boolean',
    default: false,
  },
}

// one store to rule them all. Use STORE in the main proccess and call STORAGE on the renderer side
export type StoreType = Record<StoreKeys, any>;
export const STORE: Store<StoreType> = new Store({
  // NOTE Not ready to use this yet as it will break the app
  // schema: STORE_SCHEMA,
});
