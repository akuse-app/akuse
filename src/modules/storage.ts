// only use on renderer side

import { ipcRenderer } from 'electron';
import { LanguageOptions, StoreKeys, StoreType } from './storeVariables';

const getStore = async (): Promise<StoreType> => {
  const store: StoreType = await ipcRenderer.invoke('getStore');
  return store;
};

const getLogged = async (): Promise<boolean> => {
  const logged = await ipcRenderer.invoke('getStoreValue', 'logged');
  return logged;
};

const getAccessToken = async (): Promise<string> => {
  const token = await ipcRenderer.invoke('getStoreValue', 'access_token');
  return token;
};

const getUpdateProgress = async (): Promise<boolean> => {
  const progress = await ipcRenderer.invoke('getStoreValue', 'update_progress');
  return progress;
};

const getDubbed = async (): Promise<boolean> => {
  const dubbed = await ipcRenderer.invoke('getStoreValue', 'dubbed');
  return dubbed;
};

const getSourceFlag = async (): Promise<LanguageOptions> => {
  const sourceFlag = await ipcRenderer.invoke('getStoreValue', 'source_flag');
  return sourceFlag;
};

const getIntroSkipTime = async (): Promise<number> => {
  const introSkipTime = await ipcRenderer.invoke(
    'getStoreValue',
    'intro_skip_time',
  );
  return introSkipTime;
};

const getShowDuration = async (): Promise<boolean> => {
  const showDuration = await ipcRenderer.invoke(
    'getStoreValue',
    'show_duration',
  );
  return showDuration;
};

const getTrailerVolumeOn = async (): Promise<boolean> => {
  const trailerVolumeOn = await ipcRenderer.invoke(
    'getStoreValue',
    'trailer_volume_on',
  );
  return trailerVolumeOn;
};

const set = async (key: StoreKeys, value: any): Promise<void> => {
  await ipcRenderer.invoke('setStoreValue', key, value);
};

export const STORAGE = {
  getStore,
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
