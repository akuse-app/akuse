'use-strict'

// MODULES
const { ipcRenderer } = require('electron')
const url = require('url')
const Hls = require('hls.js')

const AniListAPI = require ('../modules/anilistApi')
const AnimeScrapeAPI = require ('../modules/animeScrapeApi.js')
const HTMLManipulation = require ('../modules/htmlManipulation')
const clientData = require ('../modules/clientData.js')

// consumet
/* import { BOOKS } from "@consumet/extensions" */
const Consumet = require ('@consumet/extensions')

// CONSTANTS
const anilist = new AniListAPI(clientData)
const anime = new AnimeScrapeAPI()
const htmlMan = new HTMLManipulation()

// press login button
const loginButton = document.getElementById("login-button")
loginButton.addEventListener("click", () => {
    ipcRenderer.invoke('open-login-page')
})

// OAuth is completed, so load the page with all the elements
ipcRenderer.on('load-page-elements', async (event, token) => {
    document.getElementById('login-button').style.display = 'none'
    document.getElementById('login-page').style.display = 'none'

    const viewerId = await anilist.getViewerId(token)
    
    // display current
    const entriesCurrent = await anilist.getViewerList(token, viewerId, 'COMPLETED')
    htmlMan.displayAnimeSection(entriesCurrent)

    const entryFeatured = await anilist.getAnimeInfo(1)
    htmlMan.displayFeaturedAnime(entryFeatured)

    const userInfo = await anilist.getUserInfo(token, viewerId)
    htmlMan.displayUserAvatar(userInfo)
    
    // link test
    
    /* await anime.getEntryLink(entriesCurrent[0])
    console.log('finished') */

    const animesaturn = new Consumet.ANIME.AnimeSaturn

    const results = animesaturn.search("One Piece").then(data => {
    // print results
        console.log(data)
        let animeId = data.results[0].id
        
        const animeInfo = animesaturn.fetchAnimeInfo(animeId).then(data => {
            console.log(data)
        })

        const roba = animesaturn.fetchEpisodeSources("One-Piece-ep-1").then(data => {
            console.log(data)
        })
    })

    /* var link = await anime.getEntryLink(entriesCurrent[10])
    if (link == -1) {
        console.log('could not scrape the link')
    } else {
        console.log(link)
        htmlMan.displayIFrame(link)
    } */
})

// dynamic anime search bar (NOT WORKING)
addEventListener("input", (event) => {
    htmlMan.searchWithBar()
})

// trigger anime-entry childs and retrieve id (DOES NOT WORK FOR ALL SECTIONS)
var list = document.getElementById('current')
list.addEventListener('click', function(event) {
    htmlMan.triggerAnimeEntry(event)
})

// anime page closer
const exit_button = document.getElementById('exit')
exit_button.addEventListener('click', (event) => {
    htmlMan.closeAnimePage()
})

// drag n scroll
const slider = document.getElementsByClassName('anime-list-wrapper')[0];
let mouseDown = false;
let startX, scrollLeft;

let startDragging = function (event) {
    mouseDown = true;
    startX = event.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
};
let stopDragging = function (event) {
    mouseDown = false;
};

slider.addEventListener('mousemove', (event) => {
    event.preventDefault();
    if(!mouseDown) { return; }
    const x = event.pageX - slider.offsetLeft;
    const scroll = x - startX;
    slider.scrollLeft = scrollLeft - scroll;
});

slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);

// fade-in animation when some items are in the document viewport (TO REMOVE)
/* const element = document.getElementsByClassName("fade-in")
Object.keys(element).forEach( (key) => {
    if (htmlMan.isInViewport(element[key])) {
        element[key].classList.add('show')
    }
})

document.addEventListener("scroll", () => {
    Object.keys(element).forEach( (key) => {
        if (htmlMan.isInViewport(element[key])) {
            element[key].classList.add('show')
        }
    })
}) */
var video = document.getElementById('video');
  if(Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource('https://www.saturnspeed54.org/DDL/ANIME/OnePiece/0001/playlist.m3u8');
    hls.attachMedia(video);
    video.play();
  }
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = 'https://www.saturnspeed54.org/DDL/ANIME/OnePiece/0001/playlist.m3u8';
    video.addEventListener('loadedmetadata',function() {
      video.play();
    });
  }