const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')
const axios = require('axios');

const clientData = {
}

method = 'POST'
graphQLUrl = 'https://graphql.anilist.co'
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

const createWindow = () => {
    const win  = new BrowserWindow({
        width: 1280,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    })
    win.loadFile("src/index.html")

    // press login button
    ipcMain.on("open-login-page", (event) => {
        const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientData.clientId + "&redirect_uri=" + clientData.redirectUri + "&response_type=code"

        win.loadURL(authUrl).then(async () => {
            // TEST
            /* const webContents = event.sender
            const win = BrowserWindow.fromWebContents(webContents)
            win.setTitle("Loggato!") */

            win.loadFile("src/main.html")

            const token = await getAccessToken()
            /* console.log("\ntoken: " + token) */

            const viewerId = await getViewerId(token)
            /* console.log("\nviewerId: " + viewerId) */

        })
    })

    async function getAccessToken() {
        const currentUrl = new URL(win.webContents.getURL())
        const code = currentUrl.searchParams.get("code")

        const url = "https://anilist.co/api/v2/oauth/token"
        const data = {
            'grant_type': 'authorization_code',
            'client_id': clientData.clientId,
            'client_secret': clientData.clientSecret,
            'redirect_uri': clientData.redirectUri,
            'code': code
          }

        const respData = await axiosRequest(method, url, headers, data)
        return respData.access_token
    }
    
    async function getViewerId(token) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        const data = {
            'query': `
                query {
                    Viewer {
                        id
                    }
                }
            `
        }

        const respData = await axiosRequest(method, graphQLUrl, headers, data)
        return respData.data.Viewer.id
    }

    async function axiosRequest(method, url, headers, data) {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: data
        })

        return response.data
    }
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
