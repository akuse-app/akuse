'use-strict'

const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const LoadingBar = require('../modules/frontend/loadingBar')
const clientData = require('../modules/clientData.js')
const { TvType } = require('@consumet/extensions')
const { parse } = require('dotenv')

const store = new Store()
const frontend = new Frontend()
const loadingBar = new LoadingBar()

var iconifyButton = document.getElementById('document-iconify')
iconifyButton.addEventListener('click', () => {
    ipcRenderer.send('iconify-document')
})

var maximizeButton = document.getElementById('document-maximize')
maximizeButton.addEventListener('click', () => {
    ipcRenderer.send('maximize-document')
})

var quitButton = document.getElementById('document-quit')
quitButton.addEventListener('click', () => {
    ipcRenderer.send('quit-document')
})

var bugReportButton = document.getElementById('user-dropdown-bug-report')
bugReportButton.addEventListener('click', (event) => {
    ipcRenderer.send('load-issues-url')
})

/* var exitReportButton = document.getElementById('user-dropdown-exit')
exitReportButton.addEventListener('click', (event) => {
    ipcRenderer.send('exit-app')
}) */

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
ipcRenderer.on('load-index', async (event) => {
    setTimeout(async () => {
        const anilist = new AniListAPI(clientData) // defining it here because its constructor must be loaded here

        const viewerId = await anilist.getViewerId()
        // load first part
        const viewerInfo = await anilist.getViewerInfo(viewerId)
        const entriesFeatured = await anilist.getTrendingAnimes()
        loadingBar.initPageBar()
        const entriesCurrent = await anilist.getViewerList(viewerId, 'CURRENT')
        const entriesTrending = await anilist.getTrendingAnimes()
        const entriesMostPopular = await anilist.getMostPopularAnimes()
        const entriesAdventure = await anilist.getAnimesByGenre("Adventure")
        const entriesComedy = await anilist.getAnimesByGenre("Comedy")
        const entriesFantasy = await anilist.getAnimesByGenre("Fantasy")
        const entriesHorror = await anilist.getAnimesByGenre("Horror")
        const entriesMusic = await anilist.getAnimesByGenre("Music")
        
        frontend.displayGenreAnimeSection(entriesMostPopular, 'most-popular-home')
        frontend.displayGenreAnimeSection(entriesAdventure, 'adventure-home')
        frontend.displayGenreAnimeSection(entriesComedy, 'comedy-home')
        frontend.displayGenreAnimeSection(entriesFantasy, 'fantasy-home')
        frontend.displayGenreAnimeSection(entriesHorror, 'horror-home')
        frontend.displayGenreAnimeSection(entriesMusic, 'music-home')
        frontend.displayViewerAvatar(viewerInfo)
        frontend.displayFeaturedAnime(entriesFeatured)
        if(entriesCurrent !== undefined)
            frontend.displayUserAnimeSection(entriesCurrent, 'current-home', true)
        frontend.displayGenreAnimeSection(entriesTrending, 'trending-home')
    
        // when first part is loaded, remove loading page
        loadingBar.fillPageBar()
        setTimeout(() => {
            frontend.removeLoadingPage()
        }, 400)
    
        // load second part
        const entriesPlanning = await anilist.getViewerList(viewerId, 'PLANNING')
        const entriesCompleted = await anilist.getViewerList(viewerId, 'COMPLETED')
        const entriesDropped = await anilist.getViewerList(viewerId, 'DROPPED')
        const entriesPaused = await anilist.getViewerList(viewerId, 'PAUSED')
        const entriesRepeating = await anilist.getViewerList(viewerId, 'REPEATING')
    
        if(entriesCurrent !== undefined)
            frontend.displayUserAnimeSection(entriesCurrent, 'current-my-list', true)
        if(entriesPlanning !== undefined)
            frontend.displayUserAnimeSection(entriesPlanning, 'planning-my-list', true)
        if(entriesCompleted !== undefined)
            frontend.displayUserAnimeSection(entriesCompleted, 'completed-my-list', true)
        if(entriesDropped !== undefined)
            frontend.displayUserAnimeSection(entriesDropped, 'dropped-my-list', true)
        if(entriesPaused !== undefined)
            frontend.displayUserAnimeSection(entriesPaused, 'paused-my-list', true)
        if(entriesRepeating !== undefined)
            frontend.displayUserAnimeSection(entriesRepeating, 'repeating-my-list', true)
    }, 1000)
})
