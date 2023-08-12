'use strict'

const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')


const AniListAPI = require ('./modules/anilistApi.js')
const AnimeSaturnScrapeAPI = require ('./modules/animesaturnScrapeApi.js')

const clientData = {
}

const method = 'POST'
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

const createWindow = () => {
    const win  = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    })
    win.loadFile("src/windows/index.html")

    // press login button
    ipcMain.on("open-login-page", (event) => {
        const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientData.clientId + "&redirect_uri=" + clientData.redirectUri + "&response_type=code"

        win.loadURL(authUrl).then(async () => {
            win.loadFile("src/windows/main.html")

            const anilist = new AniListAPI(clientData)
            const animesaturn = new AnimeSaturnScrapeAPI()

            const currentUrl = new URL(win.webContents.getURL())
            const token = await anilist.getAccessToken(currentUrl)
            /* console.log("\ntoken: " + token) */

            const viewerId = await anilist.getViewerId(token)
            /* console.log("\nviewerId: " + viewerId) */
            
            const entries = await anilist.getWatching(token, viewerId)
            console.log("\nentries: " + JSON.stringify(entries))

            const document = await animesaturn.getDocument()

            console.log(document.window.document.getElementById("livesearch"))
        })
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
})
