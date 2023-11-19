'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const Store = require('electron-store')
const AniListAPI = require ('./modules/anilist/anilistApi.js')
const clientData = require ('./modules/clientData.js')
const server = require('./server.js')
const { autoUpdater, AppUpdater } = require("electron-updater")

const store = new Store()
const authUrl = 'https://anilist.co/api/v2/oauth/authorize?client_id=' + clientData.clientId + '&redirect_uri=' + clientData.redirectUri + '&response_type=code'
const githubOpenNewIssueUrl = 'https://github.com/aleganza/akuse/issues/new'

let mainWin

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoRunAppAfterInstall = true

const createWindow = () => {
    mainWin  = new BrowserWindow({
        width: 1300,
        height: 850,
        minWidth: 854,
        minHeight: 480,
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
    mainWin.show()
    mainWin.maximize()
    
    mainWin.webContents.on('did-finish-load', () => {
        // store.set('access_token', token)
        store.set('logged', false)
        mainWin.webContents.send('load-app')
        
        autoUpdater.checkForUpdates()
    })
}

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

/* APP CLOSING */

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
