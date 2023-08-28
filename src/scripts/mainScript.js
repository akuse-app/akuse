'use-strict'

const { ipcRenderer } = require('electron')
const Consumet = require('@consumet/extensions')
const AniListAPI = require('../modules/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()

// press login button
/* const loginButton = document.getElementById("login-button")
loginButton.addEventListener("click", () => {
    ipcRenderer.invoke('open-login-page')
}) */

// OAuth is completed, so load the page with all the elements
ipcRenderer.on('load-page-elements', async (event, token) => {
    console.log('ciao' + JSON.stringify(token))
    /* document.getElementById('login-button').style.display = 'none'
    document.getElementById('login-page').style.display = 'none' */

    const viewerId = await anilist.getViewerId(token)
    
    // display current watching animes
    const entriesCurrent = await anilist.getViewerList(token, viewerId, 'CURRENT')
    frontend.displayAnimeSection(entriesCurrent)

    const entryFeatured = await anilist.getAnimeInfo(1)
    frontend.displayFeaturedAnime(entryFeatured)

    const userInfo = await anilist.getUserInfo(token, viewerId)
    frontend.displayUserAvatar(userInfo)
})

// dynamic animes search bar (NOT WORKING)
addEventListener("input", (event) => {
    frontend.searchWithBar()
})

// dynamic episodes search bar (NOT WORKING)
document.getElementById('page-anime-search-button').addEventListener('click', (event) => {
    var input = document.getElementById('page-anime-search-input')

    if(input.style.display === 'none') {
        input.style.display = 'block'
    } else if(input.style.display === 'block') {
        input.style.display = 'none'
    }
})

// navbar translating
var lastScroll = 0
var nav = document.getElementById('nav-main')

var shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow');

document.addEventListener("scroll", (event) => {
    var scroll = window.scrollY

        if(scroll > lastScroll && lastScroll === 0) {
            /* console.log("attiva") */
            nav.style.marginTop = '15px'
            nav.style.boxShadow = shadow
        } else if(scroll === 0 && lastScroll !== 0){
            /* console.log("disattiva") */
            nav.style.marginTop = '0px'
            nav.style.boxShadow = 'none'
        }
    
    lastScroll = scroll
});

// trigger anime-entry childs and retrieve id (DOES NOT WORK FOR ALL SECTIONS)
var entry_list = document.getElementById('current')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

// trigger when episode is pressed, so generate video link
var episode_list = document.getElementById('page-anime-episodes-list')
episode_list.addEventListener('click', (event) => {
    frontend.triggerEpisode(event)
})

// if pressed Esc while video is fullscreen, close the video
window.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && fullscreen){
        e.preventDefault();
        
   }
});

// show anime page when featured anime button is pressed
var featured_button = document.querySelectorAll('button[id^="featured-anime-button-"]')[0]
featured_button.addEventListener('click', (event) => {
    console.log(featured_button.id.slice(22))
    frontend.displayAnimePage(featured_button.id.slice(22))
})

// anime page closer
const exit_button = document.getElementById('exit')
exit_button.addEventListener('click', (event) => {
    frontend.closeAnimePage()
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