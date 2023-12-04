'use-strict'

const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const LoadingBar = require('../modules/frontend/loadingBar')
const clientData = require('../modules/clientData.js')

const store = new Store()
const frontend = new Frontend()
const loadingBar = new LoadingBar()

let loginButton= document.getElementById('login-icon')
loginButton.addEventListener('click', (event) => {
    ipcRenderer.send('load-login-url')
})

let bugReportButton = document.getElementById('user-dropdown-bug-report')
bugReportButton.addEventListener('click', (event) => {
    ipcRenderer.send('load-issues-url')
})

ipcRenderer.on('console-log', (event, toPrint) => {
    console.log(toPrint)
})

ipcRenderer.on('auto-update', async (event) => {
    frontend.displayAutoUpdatePage()
})

ipcRenderer.on('update-available-info', async (event, info) => {
    document.getElementById('auto-update-date').innerHTML = info.releaseDate.split('T')[0]
    document.getElementById('auto-update-version').innerHTML = info.releaseName
    document.getElementById('auto-update-notes').innerHTML = info.releaseNotes
})

ipcRenderer.on('downloading', (sender, data) => {
    progress_bar_div = document.getElementById('auto-update-progress-bar')
    megabytes_div = document.getElementById('auto-update-megabytes')

    progress_bar_div.style.width = data.percent + "%"
    console.log(progress_bar_div.style.width + ' ' + data.percent + "%")
    megabytes_div.innerHTML = (data.percent * data.total / 100 / 1024 / 1024).toFixed(2)
                               + " / "
                               + (data.total / 1024 / 1024).toFixed(2)
                               + " MB - "
                               + (data.bytesPerSecond / 1024 / 1024).toFixed(2)
                               + " MB/s"
})

document.getElementById('auto-update-download').addEventListener('click', async () => {
    ipcRenderer.send('download-update')
    document.getElementById('auto-update-notes').innerHTML = "Downloading update..."
    document.getElementById('auto-update-notes').innerHTML += "<br>"
    document.getElementById('auto-update-notes').innerHTML += "Please wait and do not close the application."
})

// auto update test
ipcRenderer.on('message', async (event, msg) => {
    console.log(msg)
})

/**
 * OAuth is completed, so load the page with all the elements
 * 
 */
ipcRenderer.on('load-app', async (event) => {
    const anilist = new AniListAPI(clientData)
    let logged = store.get('logged')
    
    if(logged) {
        var viewerId = await anilist.getViewerId()
        
        document.getElementById('nav-login').classList.remove('show-li')
        document.getElementById('nav-user').classList.add('show-li')
        
        frontend.displayViewerAvatar(await anilist.getViewerInfo(viewerId))
        frontend.displayUserAnimeSection(await anilist.getViewerList(viewerId, 'CURRENT'), 'current-home', true)

        document.getElementById('current-home-section').classList.remove('hide-section')
    } else {
        document.getElementById('nav-user').classList.remove('show-li')
        document.getElementById('nav-login').classList.add('show-li')

        document.getElementById('current-home-section').classList.add('hide-section')
    }


    let authFlag = logged === true
                   ? viewerId
                   : undefined

    // discover lists
    let featuredEntries = await anilist.getTrendingAnimes(authFlag)
    frontend.displayFeaturedAnime(featuredEntries)
    frontend.displayGenreAnimeSection(featuredEntries, 'trending-home')
    frontend.displayGenreAnimeSection(await anilist.getMostPopularAnimes(authFlag), 'most-popular-home')
    frontend.displayGenreAnimeSection(await anilist.getAnimesByGenre("Adventure", authFlag), 'adventure-home') 
    frontend.displayGenreAnimeSection(await anilist.getAnimesByGenre("Comedy", authFlag), 'comedy-home') 
    frontend.displayGenreAnimeSection(await anilist.getAnimesByGenre("Fantasy", authFlag), 'fantasy-home')
    frontend.displayGenreAnimeSection(await anilist.getAnimesByGenre("Horror", authFlag), 'horror-home') 
    frontend.displayGenreAnimeSection(await anilist.getAnimesByGenre("Music", authFlag), 'music-home')

    // user lists
    if(logged) {
        frontend.displayUserAnimeSection(await anilist.getViewerList(viewerId, 'PLANNING'), 'planning-my-list', true)
        frontend.displayUserAnimeSection(await anilist.getViewerList(viewerId, 'COMPLETED'), 'completed-my-list', true)
        frontend.displayUserAnimeSection(await anilist.getViewerList(viewerId, 'DROPPED'), 'dropped-my-list', true)      
        frontend.displayUserAnimeSection(await anilist.getViewerList(viewerId, 'PAUSED'), 'paused-my-list', true)
        frontend.displayUserAnimeSection(await anilist.getViewerList(viewerId, 'REPEATING'), 'repeating-my-list', true)
    }

    setTimeout(() => {
        frontend.doDisplayAnimeSectionsScrollingButtons()
    }, 1000)
})
