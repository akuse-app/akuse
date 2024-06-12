import { ReactElement, ReactNode, createContext, useContext } from 'react';
import { STORE, STORE_SCHEMA, StoreKeys, StoreType } from '../../modules/storeVariables';
import { useStorage } from '../hooks/storage';

export type StorageContextType = {
  logged: boolean;
  accessToken: string;
  updateProgress: boolean;
  watchDubbed: boolean;
  selectedLanguage: string;
  skipTime: number;
  showDuration: boolean;
  trailerVolumeOn: boolean;
  updateStorage: (key: StoreKeys, value: any) => void;
};

const StorageContext = createContext<StorageContextType>({
  logged: STORE_SCHEMA.logged.default,
  accessToken: STORE_SCHEMA.access_token.default,
  updateProgress: STORE_SCHEMA.update_progress.default,
  watchDubbed: STORE_SCHEMA.dubbed.default,
  selectedLanguage: STORE_SCHEMA.source_flag.default,
  skipTime: STORE_SCHEMA.intro_skip_time.default,
  showDuration: STORE_SCHEMA.show_duration.default,
  trailerVolumeOn: STORE_SCHEMA.trailer_volume_on.default,
  updateStorage: () => {},
});

export function useStorageContext() {
  return useContext(StorageContext);
}

export function StorageProvider({children}: {children: ReactNode}): ReactElement {

  const store = useStorage();

  return (
    <StorageContext.Provider value={store}>{children}</StorageContext.Provider>
  );
}
