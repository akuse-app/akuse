'use-strict'

const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const LoadingBar = require('../modules/frontend/loadingBar')
const Video = require('../modules/frontend/video')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()
const loadingBar = new LoadingBar()
const video = new Video()

// toggler for the app apges
var homeNav = document.getElementById('nav-home')
var myListNav = document.getElementById('nav-my-list')
var homePageMain = document.querySelector('main#home-page')
var myListPageMain = document.querySelector('main#my-list-page')

homeNav.addEventListener('click', (event) => {
    frontend.togglePage(homePageMain, myListPageMain, homeNav, myListNav)
})

myListNav.addEventListener('click', (event) => {
    frontend.togglePage(myListPageMain, homePageMain, myListNav, homeNav)
})

// akuse logo in navbar takes you to the top of the page
document.getElementById('nav-img').onclick = () => document.getElementsByClassName('body-container')[0].scrollTo({ top: 0, behavior: 'smooth' })

// dynamic episodes search bar (NOT WORKING)
document.getElementById('page-anime-search-button').addEventListener('click', (event) => {
    var input = document.getElementById('page-anime-search-input')

    if(input.style.display == 'none') {
        input.style.display = 'block'
    } else if(input.style.display === 'block') {
        input.style.display = 'none'
    }
})

// user section
/* var userSection = document.getElementById('user-section')
userSection.addEventListener('click', (event) => {
    frontend.toggleUserDropdown()
}) */

// main search bar listeners
var scroller = document.getElementsByClassName('body-container')[0]
var searchMainInput = document.getElementById('search-main-input')
var searchMainDiv = document.getElementById('main-search-list-container')

var typingTimer
var doneTypingInterval = 250

searchMainInput.addEventListener('input', async (event) => {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(async () => {
        let searchEntries = await anilist.getSearchedAnimes(searchMainInput.value)
        frontend.displaySearchedAnimes(searchEntries)

        if(searchMainDiv.style.display == 'none') frontend.openMainSearchBar()

    }, doneTypingInterval)
})

/*
    close main search bar when:
    - an element outside the search bar / list is clicked
    - input is empty
    - the document is scrolled
*/
document.addEventListener('click', (event) => {
    if(searchMainDiv.style.display == 'flex' && (!(event.target.closest('#main-search-list-container')) && !(event.target.closest('.search-main-bar')))) {
        console.log('ora')
        frontend.closeMainSearchBar()
    }
})

if(searchMainInput.value == '') {
    frontend.closeMainSearchBar
}

scroller.addEventListener("scroll", (event) => {
    if(searchMainDiv.style.display == 'flex') {
        frontend.closeMainSearchBar()
    }
})

// open settings modal page
var settingsButton = document.getElementById('user-dropdown-settings')
settingsButton.addEventListener('click', (event) => {
    frontend.displaySettingsPage()
})

var exit_button = document.querySelector('.settings-page #exit')
exit_button.addEventListener('click', (event) => {
    frontend.closeSettingsPage()
})

var sourceItem = document.getElementById('source-item')
var anilistItem = document.getElementById('anilist-item')
var sourceRightElement = document.getElementById('source-right-element')
var anilistRightElement = document.getElementById('anilist-right-element')

sourceItem.addEventListener('click', (event) => {
    if(sourceRightElement.style.display == 'none') {
        sourceItem.classList.toggle('active')
        anilistItem.classList.toggle('active')
        anilistRightElement.style.display = 'none'
        sourceRightElement.style.display = 'block'
    }
})

anilistItem.addEventListener('click', (event) => {
    if(anilistRightElement.style.display == 'none') {
        anilistItem.classList.toggle('active')
        sourceItem.classList.toggle('active')
        sourceRightElement.style.display = 'none'
        anilistRightElement.style.display = 'block'
    }
})

// open list-editor modal page
var settings_button = document.getElementById('page-anime-list-editor')
settings_button.addEventListener('click', (event) => {
    frontend.displayListEditorPage()
})

var exit_button = document.querySelector('.list-editor-page #exit')
exit_button.addEventListener('click', (event) => {
    frontend.closeListEditorPage()
})

// list-editor save
var list_editor_button = document.getElementById('list-editor-save')
list_editor_button.addEventListener('click', (event) => {
    frontend.listEditor()
})

// list-editor delete
var list_editor_button = document.getElementById('list-editor-delete')
list_editor_button.addEventListener('click', (event) => {
    // not working due to an unusual bug
    /* frontend.listEditorDelete() */
})

// navbar background changing
var lastScroll = 0
var nav_div = document.getElementById('nav-wrapper')
var body_container_div = document.getElementsByClassName('body-container')[0]
var color = getComputedStyle(document.documentElement).getPropertyValue('--color-0')

body_container_div.addEventListener("scroll", (event) => {
    var scroll = body_container_div.scrollTop

        if(scroll > lastScroll && lastScroll === 0) {
            setTimeout(() => {
                nav_div.style.backgroundColor = color
                nav_div.classList.toggle('shadow')
            }, 100)
        } else if(scroll === 0 && lastScroll !== 0){
            nav_div.style.backgroundColor = 'transparent'
            nav_div.classList.toggle('shadow')
        }
    
    lastScroll = scroll
})

// trigger childs and retrieve id to open anime modal page
var featured_scroller = document.getElementById('featured-scroller')
featured_scroller.addEventListener('click', (event) => {
    frontend.triggerFeaturedAnime(event)
})

var entry_list = document.getElementById('main-search-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerMainSearchAnime(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('current-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('trending-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('most-popular-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('adventure-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('comedy-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('fantasy-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('horror-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('music-home')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('current-my-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('planning-my-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('completed-my-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('dropped-my-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('paused-my-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

var entry_list = document.getElementById('repeating-my-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerAnimeEntry(event)
    loadingBar.completeBar()
})

// trigger when episode is pressed, so generate video link
var episode_list = document.getElementById('page-anime-episodes-list')
episode_list.addEventListener('click', (event) => {
    frontend.triggerEpisode(event)
    loadingBar.completeBar()
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

// anime page start watching/resume episode
var watch_button = document.querySelector(`button[id^="page-anime-watch-"]`)
watch_button.addEventListener('click', (event) => {
    video.displayVideo(watch_button.id.slice(17))
})

// anime page closer
var exit_button = document.querySelector('.anime-page #exit')
exit_button.addEventListener('click', (event) => {
    frontend.closeAnimePage()
})

// drag n scroll
var sliders = document.getElementsByClassName('anime-list-wrapper')

Object.keys(sliders).forEach(slider => {
    let mouseDown = false
    let startX, scrollLeft

    let startDragging = function (event) {
        mouseDown = true
        startX = event.pageX - Object.values(sliders)[slider].offsetLeft
        scrollLeft = Object.values(sliders)[slider].scrollLeft
    }
    
    let stopDragging = function (event) {
        mouseDown = false
    }

    Object.values(sliders)[slider].addEventListener('mousemove', (event) => {
        event.preventDefault()
        if(!mouseDown) { return }
        const x = event.pageX - Object.values(sliders)[slider].offsetLeft
        const scroll = x - startX
        Object.values(sliders)[slider].scrollLeft = scrollLeft - scroll
    })

    Object.values(sliders)[slider].addEventListener('mousedown', startDragging, false)
    Object.values(sliders)[slider].addEventListener('mouseup', stopDragging, false)
    Object.values(sliders)[slider].addEventListener('mouseleave', stopDragging, false)
})
