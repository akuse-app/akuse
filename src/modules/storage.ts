// only use on renderer side

import { ipcRenderer } from "electron";
import { DEFAULTS, LanguageOptions, StoreKeys } from "./storeVariables";

const getLogged = async (): Promise<boolean> => {
  const logged = await ipcRenderer.invoke('getStoreValue', 'logged');
  return logged;
}

const getAccessToken = async (): Promise<string> => {
  const token = await ipcRenderer.invoke('getStoreValue', 'access_token');
  return token || '';
};

const getUpdateProgress = async ():Promise<boolean> => {
  const progress = await ipcRenderer.invoke('getStoreValue', 'update_progress');
  return progress;
}

const getDubbed = async (): Promise<boolean> => {
  const dubbed = await ipcRenderer.invoke('getStoreValue', 'dubbed');
  return dubbed || DEFAULTS.dubbed;
}

const getSourceFlag = async (): Promise<LanguageOptions> => {
  const sourceFlag = await ipcRenderer.invoke('getStoreValue', 'source_flag');
  return sourceFlag || DEFAULTS.source_flag;
};

const getIntroSkipTime = async (): Promise<number> => {
  const introSkipTime = await ipcRenderer.invoke('getStoreValue', 'intro_skip_time');
  return introSkipTime || DEFAULTS.intro_skip_time;
}

const getShowDuration = async (): Promise<boolean> => {
  const showDuration = await ipcRenderer.invoke('getStoreValue', 'show_duration');
  return showDuration || DEFAULTS.show_duration;
}

const getTrailerVolumeOn = async (): Promise<boolean> => {
  const trailerVolumeOn = await ipcRenderer.invoke('getStoreValue', 'trailer_volume_on');
  return trailerVolumeOn || DEFAULTS.trailer_volume_on;
}

const set = async (key: StoreKeys, value: any, callback?: () => void): Promise<void> => {
  await ipcRenderer.invoke('setStoreValue', key, value);
  if (callback) {
    void callback();
  }
}

export const STORAGE = {
  set,
  getLogged,
  getAccessToken,
  getUpdateProgress,
  getDubbed,
  getSourceFlag,
  getIntroSkipTime,
  getShowDuration,
  getTrailerVolumeOn
}
