import { useEffect, useState } from 'react';
import { STORAGE } from '../../modules/storage';
import {
  LanguageOptions,
  STORE_SCHEMA,
  StoreKeys,
  StoreType,
} from '../../modules/storeVariables';
import { StorageContextType } from '../contexts/storage';

// Maybe combine this hook with context so we only have one place to update the storage and not on every hook render call
export const useStorage = (): StorageContextType => {
  const [logged, setLogged] = useState<boolean>(STORE_SCHEMA.logged.default);
  const [accessToken, setAccessToken] = useState<string>(STORE_SCHEMA.access_token);
  const [updateProgress, setUpdateProgress] = useState<boolean>(
    STORE_SCHEMA.update_progress,
  );
  const [watchDubbed, setWatchDubbed] = useState<boolean>(STORE_SCHEMA.dubbed);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOptions>(
    STORE_SCHEMA.source_flag,
  );
  const [skipTime, setSkipTime] = useState<number>(STORE_SCHEMA.intro_skip_time);
  const [showDuration, setShowDuration] = useState<boolean>(
    STORE_SCHEMA.show_duration,
  );
  const [trailerVolumeOn, setTrailerVolumeOn] = useState<boolean>(
    STORE_SCHEMA.trailer_volume_on,
  );

  const loadStorage = async () => {
    const _logged = await STORAGE.getLogged();
    if (_logged !== logged) setLogged(_logged);

    const _accessToken = await STORAGE.getAccessToken();
    if (_accessToken !== accessToken) setAccessToken(_accessToken);

    const _updateProgress = await STORAGE.getUpdateProgress();
    if (_updateProgress !== updateProgress) setUpdateProgress(_updateProgress);

    const _watchDubbed = await STORAGE.getDubbed();
    if (_watchDubbed !== watchDubbed) setWatchDubbed(_watchDubbed);

    const _selectedLanguage = await STORAGE.getSourceFlag();
    if (_selectedLanguage !== selectedLanguage)
      setSelectedLanguage(_selectedLanguage);

    const _skipTime = await STORAGE.getIntroSkipTime();
    if (_skipTime !== skipTime) setSkipTime(_skipTime);

    const _showDuration = await STORAGE.getShowDuration();
    if (_showDuration !== showDuration) setShowDuration(_showDuration);

    const _trailerVolumeOn = await STORAGE.getTrailerVolumeOn();
    if (_trailerVolumeOn !== trailerVolumeOn)
      setTrailerVolumeOn(_trailerVolumeOn);
  };

  const updateStorage = async (key: StoreKeys, value: any) => {
    let _value = null;
    switch (key) {
      case 'logged':
        _value = await STORAGE.getLogged();
        setLogged(value);
        break;
      case 'access_token':
        _value = await STORAGE.getAccessToken();
        setAccessToken(value);
        break;
      case 'update_progress':
        _value = await STORAGE.getUpdateProgress();
        setUpdateProgress(value);
        break;
      case 'dubbed':
        _value = await STORAGE.getDubbed();
        setWatchDubbed(value);
        break;
      case 'source_flag':
        _value = await STORAGE.getSourceFlag();
        setSelectedLanguage(value);
        break;
      case 'intro_skip_time':
        _value = await STORAGE.getIntroSkipTime();
        setSkipTime(value);
        break;
      case 'show_duration':
        _value = await STORAGE.getShowDuration();
        setShowDuration(value);
        break;
      case 'trailer_volume_on':
        _value = await STORAGE.getTrailerVolumeOn();
        setTrailerVolumeOn(value);
        break;
      default:
    }

    await STORAGE.set(key, value);
    console.log(
      `store - ${key} updated to ${value} ${_value !== value ? `(was ${_value})` : ''}`,
    );
  };

  useEffect(() => {
    void loadStorage();
  }, []);

  return {
    logged,
    accessToken,
    updateProgress,
    watchDubbed,
    selectedLanguage,
    skipTime,
    showDuration,
    trailerVolumeOn,
    updateStorage,
  };
};
