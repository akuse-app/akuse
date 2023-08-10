const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const url = require('url')
const axios = require('axios');
const { head } = require("request");
const { clearInterval } = require("timers");

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
            console.log("\ntoken: " + token)

            const viewerId = await getViewerId(token)
            console.log("\nviewerId: " + viewerId)

            getWatching(token, viewerId)
            const body = await scrape()
            console.log("body: " + body)
        })
    })

    async function scrape() {
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
    }

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

        const query = `
            query {
                Viewer {
                    id
                }
            }
        `

        const options = getOptions(query)

        const respData = await axiosRequest(method, graphQLUrl, headers, options)
        return respData.data.Viewer.id
    }

    async function getWatching(token, viewerId) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        const query = `
            query($userId : Int) {
                MediaListCollection(userId : $userId, type: ANIME, status : CURRENT, sort: UPDATED_TIME) {
                    lists {
                        isCustomList
                        name
                        entries {
                            id
                            mediaId
                            progress
                            media {
                                status
                                episodes
                                title {
                                    romaji
                                    english
                                }
                                coverImage {
                                    medium
                                }
                            }
                        }
                    }
                }
            }
        `

        variables = {
            userId: viewerId,
        }

        const options = getOptions(query, variables)
        const respData = await axiosRequest(method, graphQLUrl, headers, options)

        console.log("resp: " + JSON.stringify(respData.data.MediaListCollection.lists[0].entries))
    }

    function getOptions(query, variables) {
        return JSON.stringify({
            query: query,
            variables: variables
        })
    }

    async function axiosRequest(method, url, headers, options) {
        try{
            const response = await axios({
                method: method,
                url: url,
                headers: headers,
                data: options
            })

            return response.data

        } catch(error) {
            console.log(Object.keys(error), error.message);
        }
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
