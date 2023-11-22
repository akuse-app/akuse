'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const Store = require('electron-store')
const AniListAPI = require ('./modules/anilist/anilistApi.js')
const clientData = require ('./modules/clientData.js')
const { autoUpdater, AppUpdater } = require("electron-updater")

const store = new Store()
const authUrl = 'https://anilist.co/api/v2/oauth/authorize?client_id=' + clientData.clientId + '&redirect_uri=' + clientData.redirectUri + '&response_type=code'
const githubOpenNewIssueUrl = 'https://github.com/aleganza/akuse/issues/new'

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoRunAppAfterInstall = true

let mainWin

const gotTheLock = app.requestSingleInstanceLock()
    
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', async (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWin) {
            if (mainWin.isMinimized()) mainWin.restore()
            mainWin.focus()

        }

        // logged in
        let code = commandLine[2].split('?code=')[1]
        mainWin.webContents.send("console-log", code)

        const anilist = new AniListAPI(clientData)
        const token = await anilist.getAccessToken(code)

        mainWin.webContents.send("console-log", token)
        store.set('access_token', token)
        store.set('logged', true)

        mainWin.webContents.send('load-app')
    })

    // Create mainWin, load the rest of the app, etc...
    app.on('ready', () => {
    })
}

const createWindow = () => {
    mainWin  = new BrowserWindow({
        width: 1300,
        height: 850,
        minWidth: 960,
        minHeight: 540,
        show: false,
        autoHideMenuBar: true,
        // frame: false,
        // titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#17191c',
            symbolColor: '#eee',
            height: 28
        },
        icon: 'assets/img/icon/icon.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainWin.loadFile(__dirname + '/windows/index.html')
    mainWin.setBackgroundColor('#0c0b0b')
    mainWin.show()
    // mainWin.maximize()
    
    mainWin.webContents.on('did-finish-load', () => {
        if(store.get('logged') !== true)
            store.set('logged', false)

        mainWin.webContents.send('load-app')
        autoUpdater.checkForUpdates()
    })
}

// try {
//     require('electron-reloader')(module)
// } catch (_) {}

ipcMain.on('load-login-url', () => {
    require('electron').shell.openExternal(authUrl)
})

ipcMain.on('load-issues-url', () => {
    require('electron').shell.openExternal(githubOpenNewIssueUrl)
})

app.whenReady().then(() => {
    createWindow()
    app.setAsDefaultProtocolClient("akuse")

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

/* AUTO UPDATING */

autoUpdater.on("update-available", (info) => {
    mainWin.webContents.send('auto-update')
    mainWin.webContents.send('update-available-info', info)
})

autoUpdater.on("update-downloaded", (info) => {
    autoUpdater.quitAndInstall()
})

autoUpdater.on('download-progress', (sender, data) => {
    mainWin.webContents.send('downloading', sender, data)
})

autoUpdater.on("error", (info) => {
    mainWin.webContents.send('message', info)
})

ipcMain.on('download-update', () => {
    let pth = autoUpdater.downloadUpdate()
})

/* CLOSING */

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
