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

/**
 * OAuth is completed, so load the page with all the elements
 * 
 */
ipcRenderer.on('load-page', async (event) => {
    const viewerId = await anilist.getViewerId()
    
    // load first part
    const viewerInfo = await anilist.getViewerInfo(viewerId)
    const entriesFeatured = await anilist.releasingAnimes()
    const entriesCurrent = await anilist.getViewerList(viewerId, 'CURRENT')
    const entriesTrending = await anilist.getTrendingAnimes()

    frontend.displayViewerAvatar(viewerInfo)
    frontend.displayFeaturedAnime(entriesFeatured)
    frontend.displayUserAnimeSection(entriesCurrent, 'current', true)
    frontend.displayGenreAnimeSection(entriesTrending, 'trending')

    frontend.removeLoadingPage()

    // load second part
    const entriesMostPopular = await anilist.getMostPopularAnimes()
    const entriesAdventure = await anilist.getAnimesByGenre("Adventure")
    const entriesComedy = await anilist.getAnimesByGenre("Comedy")
    const entriesFantasy = await anilist.getAnimesByGenre("Fantasy")
    const entriesHorror = await anilist.getAnimesByGenre("Horror")
    const entriesMusic = await anilist.getAnimesByGenre("Music")
    
    frontend.displayGenreAnimeSection(entriesMostPopular, 'most-popular')
    frontend.displayGenreAnimeSection(entriesAdventure, 'adventure')
    frontend.displayGenreAnimeSection(entriesComedy, 'comedy')
    frontend.displayGenreAnimeSection(entriesFantasy, 'fantasy')
    frontend.displayGenreAnimeSection(entriesHorror, 'horror')
    frontend.displayGenreAnimeSection(entriesMusic, 'music')
})
