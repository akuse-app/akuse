'use-strict'

const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()

// dynamic animes search bar (NOT WORKING)
/* addEventListener("input", (event) => {
    frontend.searchWithBar()
}) */

// dynamic episodes search bar (NOT WORKING)
document.getElementById('page-anime-search-button').addEventListener('click', (event) => {
    var input = document.getElementById('page-anime-search-input')

    if(input.style.display == 'none') {
        input.style.display = 'block'
    } else if(input.style.display === 'block') {
        input.style.display = 'none'
    }
})

// main search bar listeners
var searchMainDiv = document.getElementById('main-search-list-container')
var searchMainButton = document.getElementById('search-main-button')
var searchMainButtonIcon = document.querySelector('#search-main-button i')
var searchMainInput = document.getElementById('search-main-input')
var body = document.getElementsByTagName('body')[0]

searchMainButton.addEventListener('click', (event) => {
    if (searchMainDiv.style.display == 'none') {
        searchMainDiv.style.display = 'flex'
        searchMainButton.classList.add('active')

        body.style.overflow = 'hidden'
        searchMainInput.focus()
    } else {
        searchMainDiv.style.display = 'none'
        searchMainButton.classList.remove('active')
        
        body.style.overflow = 'auto'
        searchMainInput.value = ''
        frontend.clearSearchedAnimes()
    }
})

searchMainInput.addEventListener('input', async (event) => {
    const searchEntries = await anilist.getSearchedAnimes(searchMainInput.value)
    frontend.displaySearchedAnimes(searchEntries)
})

// navbar translating
/* var lastScroll = 0
var nav = document.getElementById('nav-main')
var shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow');

document.addEventListener("scroll", (event) => {
    var scroll = window.scrollY

        if(scroll > lastScroll && lastScroll === 0) {
            setTimeout(() => {
                nav.style.marginTop = '15px'
                nav.style.boxShadow = shadow
            }, 100)
        } else if(scroll === 0 && lastScroll !== 0){
            nav.style.marginTop = '0px'
            nav.style.boxShadow = 'none'
        }
    
    lastScroll = scroll
}); */

// navbar background changing
var lastScroll = 0
var nav = document.getElementById('nav-wrapper')
var color = getComputedStyle(document.documentElement).getPropertyValue('--color-nav');

document.addEventListener("scroll", (event) => {
    var scroll = window.scrollY

        if(scroll > lastScroll && lastScroll === 0) {
            /* console.log("attiva") */
            setTimeout(() => {
                nav.style.backgroundColor = color
            }, 100)
        } else if(scroll === 0 && lastScroll !== 0){
            /* console.log("disattiva") */
            nav.style.backgroundColor = 'transparent'
        }
    
    lastScroll = scroll
});

// trigger anime-entry childs and retrieve id to open modal page
var entry_list = document.getElementById('main-search-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerMainSearchAnime(event)
})

var entry_list = document.getElementById('current')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('trending')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('most-popular')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('adventure')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('comedy')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('fantasy')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('horror')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

var entry_list = document.getElementById('music')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
})

// trigger when episode is pressed, so generate video link
var episode_list = document.getElementById('page-anime-episodes-list')
episode_list.addEventListener('click', (event) => {
    frontend.triggerEpisode(event)
})

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
var sliders = document.getElementsByClassName('anime-list-wrapper');

Object.keys(sliders).forEach(slider => {
    let mouseDown = false;
    let startX, scrollLeft;

    let startDragging = function (event) {
        mouseDown = true;
        startX = event.pageX - Object.values(sliders)[slider].offsetLeft;
        scrollLeft = Object.values(sliders)[slider].scrollLeft;
    };
    
    let stopDragging = function (event) {
        mouseDown = false;
    };

    Object.values(sliders)[slider].addEventListener('mousemove', (event) => {
        event.preventDefault();
        if(!mouseDown) { return; }
        const x = event.pageX - Object.values(sliders)[slider].offsetLeft;
        const scroll = x - startX;
        Object.values(sliders)[slider].scrollLeft = scrollLeft - scroll;
    });

    Object.values(sliders)[slider].addEventListener('mousedown', startDragging, false);
    Object.values(sliders)[slider].addEventListener('mouseup', stopDragging, false);
    Object.values(sliders)[slider].addEventListener('mouseleave', stopDragging, false);
})
