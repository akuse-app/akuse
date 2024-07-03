import Store from 'electron-store';
const STORE = new Store();

export const setDefaultStoreVariables = () => {
  if (!STORE.has('update_progress')) STORE.set('update_progress', false);
  if (!STORE.has('dubbed')) STORE.set('dubbed', false);
  if (!STORE.has('source_flag')) STORE.set('source_flag', 'US');
  if (!STORE.has('intro_skip_time')) STORE.set('intro_skip_time', 85);
  if (!STORE.has('show_duration')) STORE.set('show_duration', true);
  if (!STORE.has('trailer_volume_on')) STORE.set('trailer_volume_on', false);
  if (!STORE.has('volume')) STORE.set('volume', 1);
}

export const getSourceFlag = async (): Promise<'IT' | 'US' | null> => {
  switch (STORE.get('source_flag')) {
    case 'US': {
      return 'US';
    }
    case 'IT': {
      return 'IT';
    }
    default: {
      return null;
    }
  }
};
