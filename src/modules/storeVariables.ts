import Store from 'electron-store';
const STORE = new Store();

const defaultValues = {
  update_progress: true,
  autoplay_next: true,
  dubbed: false,
  source_flag: 'gogo',
  intro_skip_time: 85,
  key_press_skip: 5,
  show_duration: true,
  trailer_volume_on: false,
  volume: 1,
  episodes_per_page: 30,
  history: { entries: {} },
  adult_content: true
}

export const setDefaultStoreVariables = () => {
  for(const[key, value] of Object.entries(defaultValues)) {
    if(STORE.has(key))
      continue;
    STORE.set(key, value);
  }
}

export const getSourceFlag = async (): Promise<'IT' | 'US' | 'HU' | null> => {
  switch (STORE.get('source_flag')) {
    case 'US': {
      return 'US';
    }
    case 'IT': {
      return 'IT';
    }
    case 'HU': {
      return 'HU';
    }
    default: {
      return null;
    }
  }
};
