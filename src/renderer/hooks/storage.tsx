import { useEffect, useState } from 'react';
import { STORAGE } from '../../modules/storage';
import {
  DEFAULTS,
  LanguageOptions,
  StoreKeys,
} from '../../modules/storeVariables';

export const useStorage = () => {
  const [logged, setLogged] = useState<boolean>(DEFAULTS.logged);
  const [accessToken, setAccessToken] = useState<string>(DEFAULTS.access_token);
  const [updateProgress, setUpdateProgress] = useState<boolean>(
    DEFAULTS.update_progress,
  );
  const [watchDubbed, setWatchDubbed] = useState<boolean>(DEFAULTS.dubbed);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOptions>(
    DEFAULTS.source_flag,
  );
  const [skipTime, setSkipTime] = useState<number>(DEFAULTS.intro_skip_time);
  const [showDuration, setShowDuration] = useState<boolean>(
    DEFAULTS.show_duration,
  );
  const [trailerVolumeOn, setTrailerVolumeOn] = useState<boolean>(
    DEFAULTS.trailer_volume_on,
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
