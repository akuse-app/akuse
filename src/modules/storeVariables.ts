import Store from 'electron-store';
const STORE = new Store();

export const setDefaultSourceFlag = () => {
  if (!STORE.has('source_flag')) STORE.set('source_flag', 'US');
};

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
