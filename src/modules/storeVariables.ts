import Store from 'electron-store';

// one store to rule them all. Use STORE and setupStore in main proccess and call STORAGE on the renderer side
export const STORE: Store<Record<StoreKeys, unknown>> = new Store();

export type StoreKeys =
  | 'logged'
  | 'access_token'
  | 'update_progress'
  | 'dubbed'
  | 'source_flag'
  | 'intro_skip_time'
  | 'show_duration'
  | 'trailer_volume_on';

export type LanguageOptions = 'IT' | 'US'; 

export const DEFAULTS: Record<StoreKeys, any> = {
  logged: false,
  access_token: '',
  update_progress: false,
  dubbed: false,
  source_flag: 'US',
  intro_skip_time: 85,
  show_duration: true,
  trailer_volume_on: false,
};

export const setupStore = () => {
  if (!STORE.has('logged')) STORE.set('logged', DEFAULTS.logged);
  if (!STORE.has('update_progress')) STORE.set('update_progress', DEFAULTS.update_progress);
  if (!STORE.has('dubbed')) STORE.set('dubbed', DEFAULTS.dubbed);
  if (!STORE.has('source_flag')) STORE.set('source_flag', DEFAULTS.source_flag);
  if (!STORE.has('intro_skip_time')) STORE.set('intro_skip_time', DEFAULTS.intro_skip_time);
  if (!STORE.has('show_duration')) STORE.set('show_duration', DEFAULTS.show_duration);
  if (!STORE.has('trailer_volume_on')) STORE.set('trailer_volume_on', DEFAULTS.trailer_volume_on);
}
