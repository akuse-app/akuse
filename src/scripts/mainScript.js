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
        const viewerInfo = await anilist.getViewerInfo(viewerId)

        frontend.displayViewerAvatar(viewerInfo)
        document.getElementById('nav-login').classList.remove('show-li')
        document.getElementById('nav-user').classList.add('show-li')
        
        const entriesCurrent = await anilist.getViewerList(viewerId, 'CURRENT')
        if(entriesCurrent !== undefined)
            frontend.displayUserAnimeSection(entriesCurrent, 'current-home', true)

        document.getElementById('current-home-section').classList.remove('hide-section')
    } else {
        document.getElementById('nav-user').classList.remove('show-li')
        document.getElementById('nav-login').classList.add('show-li')

        document.getElementById('current-home-section').classList.add('hide-section')
    }

    const entriesFeatured = await anilist.getTrendingAnimes()
    frontend.displayFeaturedAnime(entriesFeatured)

    const entriesTrending = await anilist.getTrendingAnimes()
    frontend.displayGenreAnimeSection(entriesTrending, 'trending-home')
    
    const entriesMostPopular = await anilist.getMostPopularAnimes()
    frontend.displayGenreAnimeSection(entriesMostPopular, 'most-popular-home')
    
    const entriesAdventure = await anilist.getAnimesByGenre("Adventure")
    frontend.displayGenreAnimeSection(entriesAdventure, 'adventure-home')

    const entriesComedy = await anilist.getAnimesByGenre("Comedy")
    frontend.displayGenreAnimeSection(entriesComedy, 'comedy-home')

    const entriesFantasy = await anilist.getAnimesByGenre("Fantasy")
    frontend.displayGenreAnimeSection(entriesFantasy, 'fantasy-home')
    
    const entriesHorror = await anilist.getAnimesByGenre("Horror")
    frontend.displayGenreAnimeSection(entriesHorror, 'horror-home')

    const entriesMusic = await anilist.getAnimesByGenre("Music")
    frontend.displayGenreAnimeSection(entriesMusic, 'music-home')

    if(logged) {
        const entriesPlanning = await anilist.getViewerList(viewerId, 'PLANNING')
        if(entriesPlanning !== undefined)
            frontend.displayUserAnimeSection(entriesPlanning, 'planning-my-list', true)
    
        const entriesCompleted = await anilist.getViewerList(viewerId, 'COMPLETED')
        if(entriesCompleted !== undefined)
            frontend.displayUserAnimeSection(entriesCompleted, 'completed-my-list', true)
    
        const entriesDropped = await anilist.getViewerList(viewerId, 'DROPPED')
        if(entriesDropped !== undefined)
            frontend.displayUserAnimeSection(entriesDropped, 'dropped-my-list', true)
    
        const entriesPaused = await anilist.getViewerList(viewerId, 'PAUSED')
        if(entriesPaused !== undefined)
            frontend.displayUserAnimeSection(entriesPaused, 'paused-my-list', true)
    
        const entriesRepeating = await anilist.getViewerList(viewerId, 'REPEATING')
        if(entriesRepeating !== undefined)
            frontend.displayUserAnimeSection(entriesRepeating, 'repeating-my-list', true)
    }

    setTimeout(() => {
        frontend.doDisplayAnimeSectionsScrollingButtons()
        
    }, 1000)
})
