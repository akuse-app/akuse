'use-strict'

const Store = require('electron-store')
const Frontend = require('../modules/frontend/frontend')

const store = new Store()
const frontend = new Frontend()

/* --- AUTO-UPDATE --- */

document.getElementById('auto-update-later').addEventListener('click', () => {
    frontend.closeAutoUpdatePage()
})

/* --- SKELETON LOADER --- */

frontend.enableSkeletonLoader()

/* --- SIDE BAR --- */

if(!store.get('logged')) {
    document.getElementById('nav-my-list').style.display = 'none'
}

/* --- MAIN PAGES --- */

frontend.togglePage()

/* --- FEATURED SECTION --- */

frontend.enableFeaturedSectionScrollingButtons()

/* --- MODAL PAGES --- */

// pressing esc closes modal pages
document.addEventListener('keydown', (event) => {
    if(event.code === 'Escape') {
        clearModalPages('Escape');
    }
})

/* --- SETTINGS MODAL PAGE --- */

// open
let settings_button = document.getElementById('user-dropdown-settings')
settings_button.addEventListener('click', () => {
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
// let sourceItem = document.getElementById('source-item')
// let anilistItem = document.getElementById('anilist-item')
// let sourceRightElement = document.getElementById('source-right-element')
// let anilistRightElement = document.getElementById('anilist-right-element')

// sourceItem.addEventListener('click', () => {
//     if(sourceRightElement.style.display == 'none') {
//         sourceItem.classList.toggle('active')
//         anilistItem.classList.toggle('active')
//         anilistRightElement.style.display = 'none'
//         sourceRightElement.style.display = 'block'
//     }
// })

// anilistItem.addEventListener('click', () => {
//     if(anilistRightElement.style.display == 'none') {
//         anilistItem.classList.toggle('active')
//         sourceItem.classList.toggle('active')
//         sourceRightElement.style.display = 'none'
//         anilistRightElement.style.display = 'block'
//     }
// })

// disable toggler if not logged in
if(!store.get('logged')) {
    document.getElementById('update-progress-checkbox').setAttribute('disabled', '')
    document.getElementById('update-progress-checkbox-slider').classList.add('disabled')
}

/* --- LIST-EDITOR MODAL PAGE (currently disabled) --- */

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
let list_editor_save_button = document.getElementById('list-editor-save')
list_editor_save_button.addEventListener('click', () => {
    frontend.listEditorSave()
})

// delete
let list_editor_delete_button = document.getElementById('list-editor-delete')
list_editor_delete_button.addEventListener('click', () => {
    // not working due to an unusual bug
    frontend.listEditorDelete()
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

/* --- ANIME SECTIONS --- */

// scrolling buttons
frontend.enableAnimeSectionsScrollingButtons()

/* --- SEARCH PAGE --- */

let search_submit_button = document.getElementById('search-submit')
search_submit_button.addEventListener('click', () => {
    frontend.searchAnimeWithFilter()
})

let search_clear_button = document.getElementById('search-clear')
search_clear_button.addEventListener('click', () => {
    document.querySelector('main .tags-container').innerHTML = ''
    document.querySelector('main .entries-container').innerHTML = ''
    document.getElementById('search-page-filter-title').value = ''
    document.getElementById('search-page-filter-genre').value = ''
    document.getElementById('search-page-filter-season').value = ''
    document.getElementById('search-page-filter-year').value = ''
    document.getElementById('search-page-filter-format').value = ''
    document.getElementById('search-page-filter-status').value = ''
    document.getElementById('search-page-filter-sort').value = ''
})

/* --- TRIGGERS --- */

// trigger when featured anime entry is pressed
let featured_scroller = document.getElementById('featured-scroller')
featured_scroller.addEventListener('click', (event) => {
    frontend.triggerFeaturedAnime(event)
})

// trigger when anime entry is pressed/hovered
let anime_lists = document.querySelectorAll('.anime-list')
anime_lists.forEach(list => {
    list.addEventListener('click', (event) => {
        frontend.triggerAnimeModal(event)
    })
    // list.addEventListener('mouseover', (event) => {
    //     frontend.triggerAnimeOverlay(event)
    // })
})

// search page
let search_list = document.querySelectorAll('.entries-container')
search_list.forEach(list => {
    list.addEventListener('click', (event) => {
        frontend.triggerAnimeModal(event)
    })
})

/* --- NAVIGATION --- */
function clearModalPages(key = '') {
    if((frontend.isAnimePageDisplayed() && !frontend.isListEditorDisplayed())
        || key != 'Escape') {
        frontend.closeAnimePage()
    }

    if(frontend.isListEditorDisplayed()) {
        frontend.closeListEditorPage()
    }

    if(frontend.isSettingsPageDisplayed()) {
        frontend.closeSettingsPage()
    }
}

document.addEventListener('keydown', (event) => {
    if (!frontend.isVideoPageDisplayed()) {
        switch(event.key) {
            case 'F1': {
                clearModalPages('F1');
                document.getElementById('nav-home').click();
                break
            }
            case 'F2': {
                if(!store.get('logged')) break
                
                clearModalPages('F2');
                document.getElementById('nav-my-list').click();
                break
            }
            case 'F3': {
                clearModalPages('F3');
                document.getElementById('nav-search').click();
                break
            }
        }
    }
})
