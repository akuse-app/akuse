'use-strict'

const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const LoadingBar = require('../modules/frontend/loadingBar')
const Video = require('../modules/frontend/video')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()
const video = new Video()

/* --- AUTO-UPDATE --- */

document.getElementById('auto-update-later').addEventListener('click', (event) => {
    frontend.closeAutoUpdatePage()
})

/* --- MAIN PAGES --- */

// toggler
let homeNav = document.getElementById('nav-home')
let myListNav = document.getElementById('nav-my-list')
let homePageMain = document.querySelector('main#home-page')
let myListPageMain = document.querySelector('main#my-list-page')

homeNav.addEventListener('click', () => {
    frontend.togglePage(homePageMain, myListPageMain, homeNav, myListNav)
})

myListNav.addEventListener('click', () => {
    frontend.togglePage(myListPageMain, homePageMain, myListNav, homeNav)
})

/* --- NAVBAR --- */

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

// akuse logo in navbar takes you to the top of the page
document.getElementById('nav-img').onclick = () => document.getElementsByClassName('body-container')[0].scrollTo({ top: 0, behavior: 'smooth' })

/* --- MAIN SEARCH BAR --- */

// listeners
var scroller = document.getElementsByClassName('body-container')[0]
var searchMainInput = document.getElementById('search-main-input')
var searchMainDiv = document.getElementById('main-search-list-container')

var typingTimer
var doneTypingInterval = 250

searchMainInput.addEventListener('input', async () => {
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
    if(searchMainDiv.style.display == 'flex' 
       && (!(event.target.closest('#main-search-list-container')) 
       && !(event.target.closest('.search-main-bar')))) {
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

/* --- FEATURED SECTION --- */

// featured section buttons
var featured_container_div = document.getElementsByClassName('featured-scroller-wrapper')[0]
var featured_scroller_div = document.getElementsByClassName('featured-scroller')[0]
var featured_left_button = document.getElementById('featured-scroll-left')
var featured_right_button = document.getElementById('featured-scroll-right')

// show
let showFeaturedScrollButtons = () => {
    featured_left_button.classList.remove('hide-opacity')
    featured_right_button.classList.remove('hide-opacity')
    featured_left_button.classList.add('show-opacity')
    featured_right_button.classList.add('show-opacity')
}

// hide
let hideFeaturedScrollButtons = () => {
    featured_left_button.classList.remove('show-opacity')
    featured_right_button.classList.remove('show-opacity')
    featured_left_button.classList.add('hide-opacity')
    featured_right_button.classList.add('hide-opacity')
}

featured_container_div.addEventListener('mouseover', showFeaturedScrollButtons)
featured_left_button.addEventListener('mouseover', showFeaturedScrollButtons)
featured_right_button.addEventListener('mouseover', showFeaturedScrollButtons)

featured_container_div.addEventListener('mouseout', hideFeaturedScrollButtons)
featured_left_button.addEventListener('mouseout', hideFeaturedScrollButtons)
featured_right_button.addEventListener('mouseout', hideFeaturedScrollButtons)

// scroll
featured_left_button.addEventListener('click', () => {
    featured_scroller_div.scrollLeft -= 1800
})

featured_right_button.addEventListener('click', () => {
    featured_scroller_div.scrollLeft += 1800
})

/* --- MODAL PAGES --- */

// pressing esc closes the modal pages
document.addEventListener('keydown', (event) => {
    if(event.code === 'Escape') {
        if(frontend.isAnimePageDisplayed()
           && !frontend.isListEditorDisplayed()) {
            frontend.closeAnimePage()
        }

        if(frontend.isListEditorDisplayed()) {
            frontend.closeListEditorPage()
        }

        if(frontend.isSettingsPageDisplayed()) {
            frontend.closeSettingsPage()
        }
    }
})

/* --- SETTING MODAL PAGE --- */

// open settings modal page
var settingsButton = document.getElementById('user-dropdown-settings')
settingsButton.addEventListener('click', (event) => {
    frontend.displaySettingsPage()
})

// close
var exit_button = document.querySelector('.settings-page #exit')
exit_button.addEventListener('click', (event) => {
    frontend.closeSettingsPage()
})

document.getElementById('settings-page').addEventListener('click', (event) => {
    if(event.target.id === 'settings-page') {
        frontend.closeSettingsPage()
    }
})

// toggler
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

/* --- LIST-EDITOR MODAL PAGE --- */

// open
var settings_button = document.getElementById('page-anime-list-editor')
settings_button.addEventListener('click', (event) => {
    frontend.displayListEditorPage()
    frontend.showListEditorInputValue('progress')
    frontend.showListEditorInputValue('score')
})

// close
var exit_button = document.querySelector('.list-editor-page #exit')
exit_button.addEventListener('click', (event) => {
    frontend.closeListEditorPage()
})

document.getElementById('list-editor-page').addEventListener('click', (event) => {
    if(event.target.id === 'list-editor-page') {
        frontend.closeListEditorPage()
    }
})

// save
var list_editor_button = document.getElementById('list-editor-save')
list_editor_button.addEventListener('click', (event) => {
    frontend.listEditor()

    // after using the list editor, update anime modal page and anime entries lists
    setTimeout(() => {
        frontend.updateAnimePageElements()

        setTimeout(() => {
            frontend.updateAnimeEntries()
        }, 500)
    }, 500)
})

// delete
var list_editor_button = document.getElementById('list-editor-delete')
list_editor_button.addEventListener('click', (event) => {
    // not working due to an unusual bug
    /* frontend.listEditorDelete() */
})

// inputs
let list_editor_progress_input = document.getElementById('list-editor-progress')
list_editor_progress_input.addEventListener('input', (event) => {
    frontend.showListEditorInputValue('progress')
})

let list_editor_score_input = document.getElementById('list-editor-score')
list_editor_score_input.addEventListener('input', (event) => {
    frontend.showListEditorInputValue('score')
})

// progress and score updating
var list_editor_progress = document.getElementById('list-editor-progress')
list_editor_progress.addEventListener('input', () => {
    document.querySelector('#list-editor-progress-limit .value').innerHTML = list_editor_progress.value
})

var list_editor_score = document.getElementById('list-editor-score')
list_editor_score.addEventListener('input', () => {
    document.querySelector('#list-editor-score-limit .value').innerHTML = list_editor_score.value
})

/* --- ANIME MODAL PAGE--- */

// start watching/resume
var watch_button = document.querySelector(`button[id^="page-anime-watch-"]`)
watch_button.addEventListener('click', () => {
    video.displayVideo(watch_button.id.slice(17))
})

// close
var exit_button = document.querySelector('.anime-page #exit')
exit_button.addEventListener('click', () => {
    frontend.closeAnimePage()
})

document.getElementById('anime-page').addEventListener('click', (event) => {
    if(event.target.id === 'anime-page') {
        frontend.closeAnimePage()
    }
})

/* ANIME SECTIONS */

// scrolling buttons
frontend.enableAnimeSectionsScrollingButtons()

/* --- TRIGGERS --- */

// trigger when featured anime entry is pressed
var featured_scroller = document.getElementById('featured-scroller')
featured_scroller.addEventListener('click', (event) => {
    frontend.triggerFeaturedAnime(event)
})

// trigger when search anime entry is pressed
var entry_list = document.getElementById('main-search-list')
entry_list.addEventListener('click', (event) => {
    frontend.triggerMainSearchAnime(event)
})

// trigger when anime entry is pressed
let anime_lists = document.querySelectorAll('.anime-list')
anime_lists.forEach(list => {
    list.addEventListener('click', (event) => {
        frontend.triggerAnimeEntry(event)
    })
})

// trigger when episode is pressed, so generate video link
var episode_list = document.getElementById('page-anime-episodes-list')
episode_list.addEventListener('click', (event) => {
    frontend.triggerEpisode(event)
})
