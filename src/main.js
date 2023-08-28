'use strict'

const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')

const AniListAPI = require ('./modules/anilistApi.js')
const clientData = require ('./modules/clientData.js')
const server = require("./server.js")

let authWin
let mainWin
const createWindow = () => {
    authWin  = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 400,
        minHeight: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js")
        }
    })
    mainWin  = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 1280,
        minHeight: 720,
        show: false,
        autoHideMenuBar: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js")
        }
    })
    const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientData.clientId + "&redirect_uri=" + clientData.redirectUri + "&response_type=code"
    authWin.loadURL(authUrl)
    authWin.webContents.on('did-navigate', async (event) => {
        console.log('Navigated to Main Window')
        authWin.close()

        const anilist = new AniListAPI(clientData)

        const currentUrl = new URL(authWin.webContents.getURL())
        const token = await anilist.getAccessToken(currentUrl)

        /* mainWin.loadFile(__dirname + "/windows/index.html") */
        mainWin.loadFile("src/windows/index.html")
        mainWin.show()
        
        mainWin.webContents.on('did-finish-load', () => {
            mainWin.webContents.send('load-page-elements', token)
        })
        /* mainWin.webContents.send('load-page-elements', token) */
    })

    /* mainWin.webContents.on('did-finish-load', () => {
        mainWin.webContents.send('load-page-elements', token)
    }) */
}



    /* win.loadFile("src/windows/index.html")

    win.webContents.send('load-page-elements', token) */


app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})
