'use-strict'

const AniListAPI = require('../modules/anilist/anilistApi')
const Frontend = require('../modules/frontend/frontend')
const Video = require('../modules/frontend/video')
const clientData = require('../modules/clientData.js')

const anilist = new AniListAPI(clientData)
const frontend = new Frontend()
const video = new Video()

/* --- AUTO-UPDATE --- */

document.getElementById('auto-update-later').addEventListener('click', () => {
    frontend.closeAutoUpdatePage()
})

/* --- SKELETON LOADER --- */

frontend.enableSkeletonLoader()

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

/* --- FEATURED SECTION --- */

frontend.enableFeaturedSectionScrollingButtons()

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

/* --- SETTINGS MODAL PAGE --- */

// open settings modal page
let settingsButton = document.getElementById('user-dropdown-settings')
settingsButton.addEventListener('click', () => {
    frontend.displaySettingsPage()
})

// close
let settings_page_exit_button = document.querySelector('.settings-page #exit')
settings_page_exit_button.addEventListener('click', () => {
    frontend.closeSettingsPage()
})

document.getElementById('settings-page').addEventListener('click', (event) => {
    if(event.target.id === 'settings-page') {
        frontend.closeSettingsPage()
    }
})

// toggler
let sourceItem = document.getElementById('source-item')
let anilistItem = document.getElementById('anilist-item')
let sourceRightElement = document.getElementById('source-right-element')
let anilistRightElement = document.getElementById('anilist-right-element')

sourceItem.addEventListener('click', () => {
    if(sourceRightElement.style.display == 'none') {
        sourceItem.classList.toggle('active')
        anilistItem.classList.toggle('active')
        anilistRightElement.style.display = 'none'
        sourceRightElement.style.display = 'block'
    }
})

anilistItem.addEventListener('click', () => {
    if(anilistRightElement.style.display == 'none') {
        anilistItem.classList.toggle('active')
        sourceItem.classList.toggle('active')
        sourceRightElement.style.display = 'none'
        anilistRightElement.style.display = 'block'
    }
})

/* --- LIST-EDITOR MODAL PAGE --- */

// open
let settings_button = document.getElementById('page-anime-list-editor')
settings_button.addEventListener('click', () => {
    frontend.displayListEditorPage()
    frontend.showListEditorInputValue('progress')
    frontend.showListEditorInputValue('score')
})

// close
let list_editor_page_exit_button = document.querySelector('.list-editor-page #exit')
list_editor_page_exit_button.addEventListener('click', () => {
    frontend.closeListEditorPage()
})

document.getElementById('list-editor-page').addEventListener('click', (event) => {
    if(event.target.id === 'list-editor-page') {
        frontend.closeListEditorPage()
    }
})

// save
let list_editor_button = document.getElementById('list-editor-save')
list_editor_button.addEventListener('click', () => {
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
list_editor_button.addEventListener('click', () => {
    // not working due to an unusual bug
    /* frontend.listEditorDelete() */
})

// inputs
let list_editor_progress_input = document.getElementById('list-editor-progress')
list_editor_progress_input.addEventListener('input', () => {
    frontend.showListEditorInputValue('progress')
})

let list_editor_score_input = document.getElementById('list-editor-score')
list_editor_score_input.addEventListener('input', () => {
    frontend.showListEditorInputValue('score')
})

// progress and score updating
let list_editor_progress = document.getElementById('list-editor-progress')
list_editor_progress.addEventListener('input', () => {
    document.querySelector('#list-editor-progress-limit .value').innerHTML = list_editor_progress.value
})

let list_editor_score = document.getElementById('list-editor-score')
list_editor_score.addEventListener('input', () => {
    document.querySelector('#list-editor-score-limit .value').innerHTML = list_editor_score.value
})

/* --- ANIME MODAL PAGE--- */

// start watching/resume
let watch_button = document.querySelector(`button[id^="page-anime-watch-"]`)
watch_button.addEventListener('click', () => {
    video.displayVideo(watch_button.id.slice(17))
})

// close
let anime_page_exit_button = document.querySelector('.anime-page #exit')
anime_page_exit_button.addEventListener('click', () => {
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
frontend.doDisplayAnimeSectionsScrollingButtons()

/* --- TRIGGERS --- */

// trigger when featured anime entry is pressed
let featured_scroller = document.getElementById('featured-scroller')
featured_scroller.addEventListener('click', (event) => {
    frontend.triggerFeaturedAnime(event)
})

// trigger when search anime entry is pressed
// let entry_list = document.getElementById('main-search-list')
// entry_list.addEventListener('click', (event) => {
//     frontend.triggerMainSearchAnime(event)
// })

// trigger when anime entry is pressed
let anime_lists = document.querySelectorAll('.anime-list')
anime_lists.forEach(list => {
    list.addEventListener('click', (event) => {
        frontend.triggerAnimeEntry(event)
    })
})

// trigger when episode is pressed, so generate video link
let episode_list = document.getElementById('page-anime-episodes-list')
episode_list.addEventListener('click', (event) => {
    frontend.triggerEpisode(event)
})
