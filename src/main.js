'use strict'

const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')

const AniListAPI = require ('./modules/anilistApi.js')
const AnimeScrapeAPI = require ('./modules/animeScrapeApi.js')

const clientData = {
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
            const anime = new AnimeScrapeAPI()

            const currentUrl = new URL(win.webContents.getURL())
            const token = await anilist.getAccessToken(currentUrl)
            /* console.log("\ntoken: " + token) */

            const viewerId = await anilist.getViewerId(token)
            /* console.log("\nviewerId: " + viewerId) */
            
            const entriesCurrent = await anilist.getViewerList(token, viewerId, 'CURRENT')
            win.webContents.send('giveEntries', entriesCurrent, 'CURRENT');

            const entrierRepeating = await anilist.getViewerList(token, viewerId, 'COMPLETED')
            win.webContents.send('giveEntries', entrierRepeating, 'COMPLETED');

            /* await anilist.getFollowingUsers(token, viewerId) */
            const userInfo = await anilist.getUserInfo(token, viewerId)
            win.webContents.send('giveUserInfo', userInfo)

            const link = await anime.getEntryLink(entriesCurrent[1])
            console.log(link)

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
