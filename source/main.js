const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')
const axios = require('axios');

const clientId = ""
const redirectUri = "http://localhost/GitHub/akuse/source/"
const clientSecret = ""

const createWindow = () => {
    const win  = new BrowserWindow({
        width: 1280,
        height: 720,
        // fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    })
    win.loadFile("source/index.html")

    ipcMain.on("open-login-page", (event) => {
        const authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + clientId + "&redirect_uri=" + redirectUri + "&response_type=code"

        win.loadURL(authUrl).then(async () => {
            // TEST
            /* const webContents = event.sender
            const win = BrowserWindow.fromWebContents(webContents)
            win.setTitle("Loggato!") */

            win.loadFile("source/main.html")
            const currentUrl = new URL(win.webContents.getURL())
            /* console.log(currentUrl) */

            const code = currentUrl.searchParams.get("code")
            /* console.log(code) */

            /* getAccessToken(code) */

            const token = await getToken(code);
            console.log(token)
        })
    })

    async function getToken(code) {
        const response = await axios({
          method: "post",
          url: `https://anilist.co/api/v2/oauth/token`,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          data: {
            'grant_type': 'authorization_code',
            'client_id': clientId,
            'client_secret': clientSecret,
            'redirect_uri': redirectUri,
            'code': code
          }
        })

        return response.data.access_token
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
