'use strict'

const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')
const axios = require('axios')
const { head } = require("request")
const { clearInterval } = require("timers")
const jsdom = require("jsdom")

const AniListAPI = require ('./scripts/anilistApi.js')

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
            // TEST
            /* const webContents = event.sender
            const win = BrowserWindow.fromWebContents(webContents)
            win.setTitle("Loggato!") */

            win.loadFile("src/windows/main.html")

            const anilist = new AniListAPI(clientData)

            /* console.log("-> " + someFunction1()) */

            const currentUrl = new URL(win.webContents.getURL())
            const token = await anilist.getAccessToken(currentUrl)
            console.log("\ntoken: " + token)

            const viewerId = await anilist.getViewerId(token)
            console.log("\nviewerId: " + viewerId)

            anilist.getWatching(token, viewerId)
            /* const htmlPage = await scrapeTwo()

            const parsedDocument = new jsdom.JSDOM(htmlPage)
            console.log(parsedDocument.window.document.getElementById("livesearch")) */
        })
    })

    async function scrapeTwo() {
        const url = "https://www.animesaturn.tv/"
        var respData = await axiosRequest("GET", url, headers, {})

        return respData
    }

    /* async function scrape() {
        const url = "https://async.scraperapi.com/jobs"
        var data = {
            'apiKey': clientData.scraperApiKey,
            'url': 'https://example.com'
        }

        var respData = await axiosRequest(method, url, {}, data)

        var status = respData.status
        var statusUrl = respData.statusUrl
        console.log("statusUrl: " + statusUrl)

        // waiting for the job to finish in order to get the body
        jobInterval = setInterval(async () => {
            respData = await axiosRequest("GET", statusUrl, {}, {})
            status = respData.status

            console.log("status: "+ status)

            if (status === "finished") {
                console.log("Job Finished!")
                clearInterval(jobInterval)

                return respData.response.body
            }
        }, 2000)
    } */
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
