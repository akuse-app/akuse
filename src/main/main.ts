/* eslint global-require: off, no-console: off, promise/always-return: off */
import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import path from 'path';

import { OPEN_NEW_ISSUE_URL, SPONSOR_URL } from '../constants/utils';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { clientData } from '../modules/clientData';
import { getAccessToken } from '../modules/anilist/anilistApi';

const STORE = new Store();

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// const authUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientData.clientId}&redirect_uri=${(isAppImage || !(app.isPackaged)) ? clientData.redirectUriAppImage : clientData.redirectUri}&response_type=code`;
const authUrl =
  'https://anilist.co/api/v2/oauth/authorize?client_id=' +
  clientData.clientId +
  '&redirect_uri=' +
  clientData.redirectUri +
  '&response_type=code';
// autoUpdater.autoDownload = false;
// autoUpdater.autoInstallOnAppQuit = true;
// autoUpdater.autoRunAppAfterInstall = true;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1300,
    height: 850,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    // titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1A1D24',
      symbolColor: '#eee',
      height: 12,
    },
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  // mainWindow.setBackgroundColor('#0c0b0b');

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.maximize();

      if (STORE.get('logged') !== true) STORE.set('logged', false);

      // mainWindow.webContents.send('load-app');
      // autoUpdater.checkForUpdates();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  new AppUpdater();
};

ipcMain.on('open-login-url', () => {
  require('electron').shell.openExternal(authUrl);
});

ipcMain.on('logout', () => {
  STORE.set('logged', false);
  STORE.delete('access_token');
  console.log('Logged Out! Relaunching app...');

  if (mainWindow) mainWindow.reload();
});

ipcMain.on('open-sponsor-url', () => {
  require('electron').shell.openExternal(SPONSOR_URL);
});

ipcMain.on('open-issues-url', () => {
  require('electron').shell.openExternal(OPEN_NEW_ISSUE_URL);
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('akuse-react', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('akuse-react');
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', async (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    try {
      let code = commandLine
        .find((el) => el.includes('?code='))
        ?.split('?code=')[1];

      await handleLogin(code);

      if (mainWindow) {
        mainWindow.reload();
      }
    } catch (error: any) {
      console.log('something went wrong second-instance', error.message);
    }
  });
}

async function handleLogin(code: any) {
  try {
    const token = await getAccessToken(code);
    STORE.set('access_token', token);
    STORE.set('logged', true);
  } catch (error: any) {
    console.log('login failed with error: ' + error.message);
  }
}

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked');
  const pagePath = path.join('file://', pageDirectory, 'index.html');
  shell.openExternal(pagePath);
});
