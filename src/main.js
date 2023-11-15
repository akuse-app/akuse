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

let authWin
let mainWin

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoRunAppAfterInstall = true

const createWindow = () => {
    authWin  = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 400,
        minHeight: 600,
        autoHideMenuBar: true,
        icon: 'assets/img/icon/icon'
    })
    
    mainWin  = new BrowserWindow({
        width: 1300,
        height: 850,
        minWidth: 1280,
        minHeight: 720,
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

    // magari far partire authWin da hidden, poi showare subito oppure chiuderla, checkare anche se chiude app premendo X
    // if(store.get('access_token')) {
    //     mainWin.loadFile(__dirname + '/windows/index.html')
    //     mainWin.show()
    //     mainWin.maximize()
        
    //     mainWin.webContents.on('did-finish-load', () => {
    //         authWin.close()
    //         mainWin.webContents.send('load-index')
    //         autoUpdater.checkForUpdates()
    //     })
    // } else {
    //     console.log('Loaded OAuth url on Auth Window')
    //     authWin.loadURL(authUrl)    
    // }

    console.log('Loaded OAuth url on Auth Window')
    authWin.loadURL(authUrl)

    authWin.webContents.on('did-navigate', async (event) => {
        const currentUrl = new URL(authWin.webContents.getURL())
        if(currentUrl.searchParams.get("code") !== null) {
            console.log("Log-in completed!")
            console.log('Navigated to Main Window')
            const anilist = new AniListAPI(clientData)
            const token = await anilist.getAccessToken(currentUrl)
        
            mainWin.loadFile(__dirname + '/windows/index.html')
            mainWin.show()
            mainWin.maximize()
            
            mainWin.webContents.on('did-finish-load', () => {
                authWin.close()
                store.set('access_token', token)
                mainWin.webContents.send('load-index')
                
                autoUpdater.checkForUpdates()
            })
        }
    })
}

ipcMain.on('load-issues-url', () => {
    require('electron').shell.openExternal(githubOpenNewIssueUrl)
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// process.noAsar = true
// try { 
//     require('electron-reloader')(module, { 
//         debug: true, 
//         watchRenderer: true
//     }); 
// } catch (_) { console.log('Error'); }  

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
