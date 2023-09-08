'use-strict'

const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()

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
var main = document.getElementsByClassName('body-container')[0]
var navContainer = document.getElementsByClassName('nav-container')[0]
var nav = document.getElementById('nav-main')

searchMainButton.addEventListener('click', (event) => {
    if (searchMainDiv.style.display == 'none') {
        frontend.openMainSearchBar()
    } else {
        frontend.closeMainSearchBar()
    }
})

document.addEventListener("scroll", (event) => {
    if(searchMainDiv.style.display == 'flex') {
        frontend.closeMainSearchBar()
    }
})

var typingTimer
var doneTypingInterval = 250

searchMainInput.addEventListener('input', async (event) => {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(async () => {
        let searchEntries = await anilist.getSearchedAnimes(searchMainInput.value)
        frontend.displaySearchedAnimes(searchEntries)
    }, doneTypingInterval)
})

// navbar background changing
var lastScroll = 0
var nav_div = document.getElementById('nav-wrapper')
var body_container_div = document.getElementsByClassName('body-container')[0]
var color = getComputedStyle(document.documentElement).getPropertyValue('--color-nav');

body_container_div.addEventListener("scroll", (event) => {
    var scroll = body_container_div.scrollTop

        if(scroll > lastScroll && lastScroll === 0) {
            setTimeout(() => {
                nav_div.style.backgroundColor = color
            }, 100)
        } else if(scroll === 0 && lastScroll !== 0){
            nav_div.style.backgroundColor = 'transparent'
        }
    
    lastScroll = scroll
});

// trigger childs and retrieve id to open anime modal page
var featured_scroller = document.getElementById('featured-scroller')
featured_scroller.addEventListener('click', (event) => {
    frontend.triggerFeaturedAnime(event)
})

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

// featured section buttons
var featured_scroller_div = document.getElementsByClassName('featured-scroller')[0]
var featured_left_button = document.getElementById('featured-scroll-left')
var featured_right_button = document.getElementById('featured-scroll-right')

featured_scroller_div.addEventListener('mouseover', (event) => {
    featured_left_button.style.display = 'block'
    featured_right_button.style.display = 'block'
})

featured_scroller_div.addEventListener('mouseout', (event) => {
    featured_left_button.style.display = 'none'
    featured_right_button.style.display = 'none'
})

featured_left_button.addEventListener('click', (event) => {
    featured_scroller_div.scrollLeft -= 1800
})

featured_right_button.addEventListener('click', (event) => {
    featured_scroller_div.scrollLeft += 1800
})

// anime page 'add to list/already on list' trigger
var list_updater_button = document.getElementById('page-anime-list-updater')
list_updater_button.addEventListener('click', (event) => {
    frontend.triggerListUpdater()
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
