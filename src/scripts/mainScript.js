'use-strict'

const { ipcRenderer } = require('electron')
const Consumet = require('@consumet/extensions')
const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()

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

var exitReportButton = document.getElementById('user-dropdown-exit')
exitReportButton.addEventListener('click', (event) => {
    ipcRenderer.send('exit-app')
})

/**
 * OAuth is completed, so load the page with all the elements
 * 
 */
ipcRenderer.on('load-index', async (event) => {
    const viewerId = await anilist.getViewerId()
    
    // load first part
    const viewerInfo = await anilist.getViewerInfo(viewerId)
    const entriesTrending = await anilist.getTrendingAnimes()
    const entriesCurrent = await anilist.getViewerList(viewerId, 'CURRENT')
    const entriesMostPopular = await anilist.getMostPopularAnimes()
    const entriesAdventure = await anilist.getAnimesByGenre("Adventure")
    const entriesComedy = await anilist.getAnimesByGenre("Comedy")
    const entriesFantasy = await anilist.getAnimesByGenre("Fantasy")
    const entriesHorror = await anilist.getAnimesByGenre("Horror")
    const entriesMusic = await anilist.getAnimesByGenre("Music")
    
    frontend.displayViewerAvatar(viewerInfo)
    frontend.displayFeaturedAnime(entriesTrending)
    frontend.displayUserAnimeSection(entriesCurrent, 'current-home', true)
    /* frontend.displayGenreAnimeSection(entriesTrending, 'trending-home') */
    frontend.displayGenreAnimeSection(entriesMostPopular, 'most-popular-home')
    frontend.displayGenreAnimeSection(entriesAdventure, 'adventure-home')
    frontend.displayGenreAnimeSection(entriesComedy, 'comedy-home')
    frontend.displayGenreAnimeSection(entriesFantasy, 'fantasy-home')
    frontend.displayGenreAnimeSection(entriesHorror, 'horror-home')
    frontend.displayGenreAnimeSection(entriesMusic, 'music-home')

    frontend.removeLoadingPage()

    const entriesPlanning = await anilist.getViewerList(viewerId, 'PLANNING')
    const entriesCompleted = await anilist.getViewerList(viewerId, 'COMPLETED')
    const entriesDropped = await anilist.getViewerList(viewerId, 'DROPPED')
    const entriesPaused = await anilist.getViewerList(viewerId, 'PAUSED')
    const entriesRepeating = await anilist.getViewerList(viewerId, 'REPEATING')

    frontend.displayUserAnimeSection(entriesCurrent, 'current-my-list', true)
    frontend.displayUserAnimeSection(entriesPlanning, 'planning-my-list', true)
    frontend.displayUserAnimeSection(entriesCompleted, 'completed-my-list', true)
    frontend.displayUserAnimeSection(entriesDropped, 'dropped-my-list', true)
    frontend.displayUserAnimeSection(entriesPaused, 'paused-my-list', true)
    frontend.displayUserAnimeSection(entriesRepeating, 'repeating-my-list', true)
})
