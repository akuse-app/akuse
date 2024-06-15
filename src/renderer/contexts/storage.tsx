import { ReactElement, ReactNode, createContext, useContext } from 'react';
import { STORE_SCHEMA, StorageContextType } from '../../modules/storeVariables';
import { useStorage } from '../hooks/storage';

const StorageContext = createContext<StorageContextType>({
  logged: STORE_SCHEMA.logged.default,
  accessToken: STORE_SCHEMA.access_token.default,
  updateProgress: STORE_SCHEMA.update_progress.default,
  watchDubbed: STORE_SCHEMA.dubbed.default,
  selectedLanguage: STORE_SCHEMA.source_flag.default,
  skipTime: STORE_SCHEMA.intro_skip_time.default,
  showDuration: STORE_SCHEMA.show_duration.default,
  trailerVolumeOn: STORE_SCHEMA.trailer_volume_on.default,
  updateStorage: async () => {},
});

export function useStorageContext() {
  return useContext(StorageContext);
}

export function StorageProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const store = useStorage();

  return (
    <StorageContext.Provider value={store}>{children}</StorageContext.Provider>
  );
}
