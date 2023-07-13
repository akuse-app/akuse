const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')
var request = require('request')

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

        win.loadURL(authUrl).then(() => {
            // TEST
            /* const webContents = event.sender
            const win = BrowserWindow.fromWebContents(webContents)
            win.setTitle("Loggato!") */

            win.loadFile("source/main.html")
            const currentUrl = new URL(win.webContents.getURL())
            /* console.log(currentUrl) */

            const code = currentUrl.searchParams.get("code")
            /* console.log(code) */

            getAccessToken(code)
        })
    })

    function getAccessToken(code) {
        var options = {
            uri: 'https://anilist.co/api/v2/oauth/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            json: {
                'grant_type': 'authorization_code',
                'client_id': clientId,
                'client_secret': clientSecret,
                'redirect_uri': redirectUri,
                'code': code
            }
        }
        
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.access_token)
            } else {
                return "Error: " + response.statusCode
            }
        })
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
