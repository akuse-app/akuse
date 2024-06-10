const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

export const OS = {
  isLinux,
  isMac,
  isWindows,
};
