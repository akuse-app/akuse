'use strict'

const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')

const AniListAPI = require ('./modules/anilistApi.js')
const AnimeScrapeAPI = require ('./modules/animeScrapeApi.js')
const clientData = require ('./modules/clientData.js')

let win

const createWindow = () => {
    win  = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: false,
        webPreferences: {
            nodeIntegration: true, // is default value after Electron v5
            contextIsolation: false, // protect against prototype pollution
            /* enableRemoteModule: false, */ // turn off remote
            preload: path.join(__dirname, "preload.js")
        }
    })
    win.loadFile("src/windows/index.html")

}

// press login button
ipcMain.handle('open-login-page', (event) => {
    const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientData.clientId + "&redirect_uri=" + clientData.redirectUri + "&response_type=code"

        win.loadURL(authUrl).then(async () => {
            win.loadFile("src/windows/index.html")

            const anilist = new AniListAPI(clientData)

            const currentUrl = new URL(win.webContents.getURL())
            const token = await anilist.getAccessToken(currentUrl)

            win.webContents.send('load-page-elements', token)
        })
})

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})
