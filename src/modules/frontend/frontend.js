'use-strict'

const AniListAPI = require ('../anilist/anilistApi')
const AnimeSaturn = require('../providers/animesaturn')
const LoadingBar = require('../frontend/loadingBar')
const Video = require('./video')
const clientData = require ('../clientData.js')

/**
 * Methods to manipulate the DOM with fetched data
 * 
 * @class
 */
module.exports = class Frontend {

    /**
     * @constructor
     */
    constructor() {
        this.anilist = new AniListAPI()
        this.cons = new AnimeSaturn()
        this.loadingBar = new LoadingBar()
        this.video = new Video()
        this.months = {
            '1': 'Jan',
            '2': 'Feb',
            '3': 'Mar',
            '4': 'Apr',
            '5': 'May',
            '6': 'Jun',
            '7': 'Jul',
            '8': 'Aug',
            '9': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        }
    }
    
    /**
     * Removes the loading div when the document has finished loading
     * @deprecated
     */
    removeLoadingPage() {
        document.getElementById('loading-page').classList.add('loading-page-animation')
        setTimeout(() => {
            document.getElementById('loading-page').style.display = 'none'
        }, 1000)
        /* document.getElementById('loading-page').style.opacity = 0
        document.getElementById('loading-page').style.display = 'none' */
    }

    /**
     * Toggler for the app apges
     * 
     * @param {*} divToShow 
     * @param {*} divToHide 
     * @param {*} navLiToShow 
     * @param {*} navLiToHide 
     */
    togglePage(divToShow, divToHide, navLiToShow, navLiToHide) {
        if(divToShow.style.display == 'none') {
            divToShow.style.display = 'block'
            divToHide.style.display = 'none'
            navLiToShow.classList.add('active')
            navLiToHide.classList.remove('active')
        }
    }

    /**
     * Call to enable skeleton loader for featured section and anime sections
     */
    enableSkeletonLoader() {
        let anime_sections = document.querySelectorAll('section')
        let featured_scroller = document.querySelector('#featured-scroller .featured-scroller-wrapper')
        const nLoaders = 10

        // featured section
        featured_scroller.appendChild(this.createFeaturedEntrySkeletonLoader())

        // anime sections
        Object.keys(anime_sections).forEach(section => {
            let destination_div = Object.values(anime_sections)[section].querySelector('.anime-list-wrapper .anime-list')

            for(let i=0; i<nLoaders; i++) {
                let anime_entry_div = this.createAnimeEntrySkeletonLoader()
                destination_div.appendChild(anime_entry_div)
            }
        })
    }

    /**
     * Creates a skeleton loader anime section entry div
     * 
     * @returns skeleton loader anime entry
     */
    createAnimeEntrySkeletonLoader() {
        let anime_entry_div = document.createElement('div')
        let anime_cover_div = document.createElement('div')
        let content_div = document.createElement('div')
        let anime_info_div = document.createElement('div')

        anime_entry_div.id = 'anime-entry--1'
        anime_entry_div.classList.add('anime-entry')
        anime_entry_div.classList.add('loading')
        anime_entry_div.classList.add('show')
        anime_cover_div.classList.add('anime-cover')
        content_div.classList.add('content')
        anime_info_div.classList.add('anime-info')

        content_div.appendChild(anime_info_div)
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(content_div)

        return anime_entry_div
    }

    /**
     * Creates a skeleton loader featured section div
     * 
     * @returns skeleton loader featured entry
     */
    createFeaturedEntrySkeletonLoader() {
        var featured_div = document.createElement('div')
        var featured_container_div = document.createElement('div')
        var content_div = document.createElement('div')
        var anime_title_div = document.createElement('div')
        var anime_info_div = document.createElement('div')
        var anime_description_div = document.createElement('div')
        var featured_anime_button = document.createElement('button')
        var anime_year_div = document.createElement('div')
        var anime_episodes_div = document.createElement('div')
        
        featured_div.classList.add('featured')
        featured_div.classList.add('loading')
        featured_container_div.classList.add('featured-container')
        // featured_left_div.classList.add('featured-left')
        // featured_shadow_div.classList.add('featured-shadow')
        // featured_right_div.classList.add('featured-right')
        content_div.classList.add('content')
        content_div.classList.add('show')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        anime_description_div.classList.add('anime-description')
        anime_year_div.classList.add('anime-year')
        anime_episodes_div.classList.add('anime-episodes')
        featured_anime_button.id = 'featured-anime-button--1'
        featured_anime_button.classList.add('main-button-0')
        
        anime_info_div.appendChild(anime_year_div)
        anime_info_div.appendChild(anime_episodes_div)
        content_div.appendChild(anime_info_div)
        content_div.appendChild(anime_title_div)
        content_div.appendChild(anime_description_div)
        content_div.appendChild(featured_anime_button)
        featured_container_div.appendChild(content_div)
        featured_div.appendChild(featured_container_div)
        
        return featured_div
    }

    /**
     * Assigns a different z-index to each section entry
     * 
     * @param {*} sectionId 
     */
    assignZIndexToAnimeEntries(sectionId){
        let section_div = document.getElementById(sectionId)
        let anime_entries = section_div.querySelectorAll('.anime-entry')

        Object.keys(anime_entries).forEach(entry => {
            let entry_div = Object.values(anime_entries)[entry]

            entry_div.style.zIndex = Object.keys(anime_entries).length - entry
        })
    }

    /**
     * Shows the modal page
     * 
     * @param {*} shadowModalDiv the shadow modal page to show
     * @param {*} pageModalDiv the modal page to show
     */
    showModalPage(shadowModalDiv, pageModalDiv) {
        document.getElementById(pageModalDiv).style.display = 'flex'
        document.getElementById(shadowModalDiv).style.display = 'flex'

        document.getElementById(pageModalDiv).classList.remove('hide-page')
        document.getElementById(pageModalDiv).classList.add('show-page')
        document.getElementById(shadowModalDiv).classList.remove('hide-page-shadow-background')
        document.getElementById(shadowModalDiv).classList.add('show-page-shadow-background')
        
        /* document.getElementsByClassName('body-container')[0].style.overflow = 'hidden' */
    }

    /**
     * Hides the modal page
     * 
     * @param {*} shadowModalDiv the shadow modal page to hide
     * @param {*} pageModalDiv the modal page to hide
     */
    hideModalPage(shadowModalDiv, pageModalDiv) {
        document.getElementById(pageModalDiv).classList.remove('show-page')
        document.getElementById(pageModalDiv).classList.add('hide-page')
        document.getElementById(shadowModalDiv).classList.remove('show-page-shadow-background')
        document.getElementById(shadowModalDiv).classList.add('hide-page-shadow-background')

        setTimeout(() => {
            document.getElementById(pageModalDiv).style.display = 'none'
            document.getElementById(shadowModalDiv).style.display = 'none'
        }, 400)
        
        /* document.getElementsByClassName('body-container')[0].style.overflow = 'auto' */
    }

    /**
     * Call this to grant anime sections scrolling by "drag-n-dropping" them
     */
    enableAnimeSectionsDragAndScroll() {
        var sliders = document.getElementsByClassName('anime-list-wrapper')

        Object.keys(sliders).forEach(slider => {
            let mouseDown = false
            let startX, scrollLeft
        
            let startDragging = function (event) {
                mouseDown = true
                startX = event.pageX - Object.values(sliders)[slider].offsetLeft
                scrollLeft = Object.values(sliders)[slider].scrollLeft
            }
            
            let stopDragging = function () {
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
    }

    /**
     * Hides useless scrolling buttons in anime sections 
    */
    doDisplayAnimeSectionsScrollingButtons() {
        let anime_sections = document.querySelectorAll('section')

        Object.keys(anime_sections).forEach(section => {
            let anime_section_wrapper = Object.values(anime_sections)[section].querySelector('.anime-list-wrapper')
            let anime_section_list = Object.values(anime_sections)[section].querySelector('.anime-list')
            let anime_section_scroll_left = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[0]
            let anime_section_scroll_right = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[1]
            let wrapperWidth = anime_section_wrapper.clientWidth
            let listWidth = anime_section_list.scrollWidth

            if(wrapperWidth > listWidth) {
                console.log(Object.values(anime_sections)[section].id)
                console.log('nascondo ', wrapperWidth, ' ', listWidth)

                anime_section_scroll_left.classList.add('hide')
                anime_section_scroll_right.classList.add('hide')
            }
        })
    }

    enableFeaturedSectionScrollingButtons() {
        // featured section buttons
        let featured_container_div = document.getElementsByClassName('featured-scroller-wrapper')[0]
        let featured_scroller_div = document.getElementsByClassName('featured-scroller')[0]
        let featured_left_button = document.getElementById('featured-scroll-left')
        let featured_right_button = document.getElementById('featured-scroll-right')

        // scroll
        featured_left_button.addEventListener('click', () => {
            featured_scroller_div.scrollLeft -= 1000
        })

        featured_right_button.addEventListener('click', () => {
            featured_scroller_div.scrollLeft += 1000
        })

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
    }

    /**
     * Call this to grant anime sections scrolling with buttons
     */
    enableAnimeSectionsScrollingButtons() {
        let anime_sections = document.querySelectorAll('section')
        const scrollAmount = 232 * 4
        
        Object.keys(anime_sections).forEach(section => {
            let anime_section_wrapper = Object.values(anime_sections)[section].querySelector('.anime-list-wrapper')
            let anime_section_list = Object.values(anime_sections)[section].querySelector('.anime-list')
            let anime_section_scroll_left = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[0]
            let anime_section_scroll_right = Object.values(anime_sections)[section].getElementsByClassName('circle-button-0')[1]
            
            let disableButtons = () => {
                let maxScroll = anime_section_list.scrollWidth - anime_section_wrapper.clientWidth

                if(anime_section_wrapper.scrollLeft == 0) {
                    anime_section_scroll_left.classList.add('disabled')
                } else {
                    anime_section_scroll_left.classList.remove('disabled')
                }

                if(anime_section_wrapper.scrollLeft == maxScroll) {
                    anime_section_scroll_right.classList.add('disabled')
                } else {
                    anime_section_scroll_right.classList.remove('disabled')
                }
            }

            // if section is too small, hde scrolling buttons
            let doHideButtons = () => {
                if(anime_section_wrapper.clientWidth > anime_section_list.scrollWidth) return true; else return false
            }
            
            // update scroll value
            anime_section_scroll_left.addEventListener('click', () => {
                anime_section_wrapper.scrollLeft -= scrollAmount
                setTimeout(() => {
                    disableButtons()
                }, 600)
            })
            
            anime_section_scroll_right.addEventListener('click', () => {
                anime_section_wrapper.scrollLeft += scrollAmount
                setTimeout(() => {
                    disableButtons()
                }, 600)
            })
            
            // show
            let showButtons = () => {
                if(doHideButtons()) return
                disableButtons()

                anime_section_scroll_left.classList.remove('hide-opacity')
                anime_section_scroll_right.classList.remove('hide-opacity')
                anime_section_scroll_left.classList.add('show-opacity')
                anime_section_scroll_right.classList.add('show-opacity')
            }
            
            // hide
            let hideButtons = () => {
                anime_section_scroll_left.classList.remove('show-opacity')
                anime_section_scroll_right.classList.remove('show-opacity')
                anime_section_scroll_left.classList.add('hide-opacity')
                anime_section_scroll_right.classList.add('hide-opacity')
            }

            // anime_section_wrapper.addEventListener('mouseover', showButtons)
            Object.values(anime_sections)[section].addEventListener('mouseenter', showButtons)
            // anime_section_scroll_left.addEventListener('mouseover', showButtons)
            // anime_section_scroll_right.addEventListener('mouseover', showButtons)
            
            // anime_section_wrapper.addEventListener('mouseout', hideButtons)
            Object.values(anime_sections)[section].addEventListener('mouseleave', hideButtons)
            // anime_section_scroll_left.addEventListener('mouseout', hideButtons)
            // anime_section_scroll_right.addEventListener('mouseout', hideButtons)
        })
    }

    /**
     * Displays the auto update modal page
     */
    displayAutoUpdatePage() {
        this.showModalPage('auto-update-page-shadow-background', 'auto-update-page')
    }

    /**
     * Closes the auto update modal page
     */
    closeAutoUpdatePage() {
        this.hideModalPage('auto-update-page-shadow-background', 'auto-update-page')
    }

    /**
     * Displays the settings modal page
     */
    displaySettingsPage() {
        this.showModalPage('settings-page-shadow-background', 'settings-page')
    }
    
    /**
     * Closes the settings modal page
    */
    closeSettingsPage() {
        this.hideModalPage('settings-page-shadow-background', 'settings-page')
    }
    
    /**
     * Displays the list editor modal page
     */
    displayListEditorPage() {
        // display current infos (if present)
        const status = document.getElementById('page-anime-user-status').innerHTML
        const progress = document.getElementById('page-anime-progress').innerHTML
        const score = document.getElementById('page-anime-score-number').innerHTML
        const availableEpisodes = document.getElementById('page-anime-available-episodes').innerHTML
          
        status == 'NOT IN LIST'
        ? document.getElementById('list-editor-user-list').value = ""
        : document.getElementById('list-editor-user-list').value = status
        
        progress == ""
        ? document.getElementById('list-editor-progress').value = ""
        : document.getElementById('list-editor-progress').value = progress

        document.getElementById('list-editor-progress').setAttribute('max', availableEpisodes)
        
        score == ""
        ? document.getElementById('list-editor-score').value = ""
        : document.getElementById('list-editor-score').value = score

        // display the limit of episodes (/24, /12...) and score (/10)
        document.querySelector('#list-editor-progress-limit .value').innerHTML = progress
        document.querySelector('#list-editor-progress-limit .limit').innerHTML = availableEpisodes

        document.querySelector('#list-editor-score-limit .value').innerHTML = score
        document.querySelector('#list-editor-score-limit .limit').innerHTML = 10

        this.showModalPage('list-editor-page-shadow-background', 'list-editor-page')
    }

    /**
     * Shows the VERY COOL wheel value above score/progress inputs in list-editor modal page
     * 
     * @param {*} type 
     */
    showListEditorInputValue(type) {
        let output = document.getElementById(`list-editor-${type}-value`)
        let value = document.getElementById(`list-editor-${type}`).value
        let limit = document.querySelector(`#list-editor-${type}-limit .limit`).innerHTML
    
        output.value = value
        output.style.left = 100 * value / limit + '%'
        // output.style.left = 'calc(' + (100 * value / limit + '%') + ' - ' +  (output.offsetWidth + 'px') +')'
    }
    
    /**
     * Closes the list editor modal page
     */
    closeListEditorPage() {
        this.hideModalPage('list-editor-page-shadow-background', 'list-editor-page')
    }
 
    /**
     * Displays a div with the searched animes
     * 
     * @param {*} animeEntries 
     */
    displaySearchedAnimes(animeEntries) {
        this.clearSearchedAnimes()

        var anime_list_div = document.getElementById('main-search-list')
        var anime_entry_div

        var scroller = document.createElement('div')
        scroller.classList.add('scroller')

        Object.keys(animeEntries).forEach(key => {
            anime_entry_div = this.createSearchAnimeEntry(animeEntries[key])
            anime_entry_div.classList.add('show')
            
            anime_list_div.appendChild(anime_entry_div)
        })

        scroller.appendChild(anime_entry_div)
    }

    /**
     * Clears the div with the searched animes in main search bar
     */
    clearSearchedAnimes() {
        document.getElementById('main-search-list').innerHTML = ''
    }

    /**
     * Opens the main search bar
     */
    openMainSearchBar() {
        var searchMainDiv = document.getElementById('main-search-list-container')
        var searchMainInput = document.getElementById('search-main-input')

        searchMainDiv.style.display = 'flex'
        searchMainInput.focus()
    }

    /**
     * Closes the main search bar
     */
    closeMainSearchBar() {
        var searchMainDiv = document.getElementById('main-search-list-container')
        var searchMainInput = document.getElementById('search-main-input')

        searchMainDiv.style.display = 'none'
        searchMainInput.value = ''
        this.clearSearchedAnimes()
    }

    /**
     * Creates the div for the anime entry
     * 
     * @param {*} animeEntry 
     * @returns anime entry DOM element
     */
    createSearchAnimeEntry(animeEntry) {
        const animeId = animeEntry.id
        const cover = animeEntry.coverImage.large
        const seasonYear = animeEntry.seasonYear
        const format = animeEntry.format
        const duration = animeEntry.duration
        const meanScore = animeEntry.meanScore
        const description = animeEntry.description
        const title = this.getTitle(animeEntry)
        const episodes = this.getEpisodes(animeEntry)

        var cover_div = document.createElement('img')
        var content_div = document.createElement('div')
        var title_h1 = document.createElement('h1')
        var infos_div = document.createElement('div')
        var entry_div = document.createElement('div')
        
        cover_div.src = cover
        content_div.classList.add('content')
        title_h1.classList.add('title')
        title_h1.innerHTML = title
        infos_div.classList.add('infos')
        entry_div.classList.add('search-entry')
        entry_div.id = ('search-anime-entry-' + animeId)

        var h2 = document.createElement('h2')
        h2.innerHTML = '<i style="margin-right: 5px" class="fa-regular fa-calendar-plus"></i>'
        var span = document.createElement('span')
        span.innerHTML = seasonYear
        h2.appendChild(span)
        infos_div.appendChild(h2)
            
        var h2 = document.createElement('h2')
        h2.innerHTML = '<i style="margin-right: 5px" class="fa-solid fa-list-ul"></i>'
        var span = document.createElement('span')
        span.innerHTML = episodes
        h2.appendChild(span)
        infos_div.appendChild(h2)

        var h2 = document.createElement('h2')
        h2.innerHTML = '<i style="margin-right: 5px" class="fa-solid fa-tv"></i>'
        var span = document.createElement('span')
        span.innerHTML = format
        h2.appendChild(span)
        infos_div.appendChild(h2)

        var h2 = document.createElement('h2')
        h2.innerHTML = '<i style="margin-right: 5px" class="fa-regular fa-clock"></i>'
        var span = document.createElement('span')
        span.innerHTML = (duration + ' Min/Ep')
        h2.appendChild(span)
        infos_div.appendChild(h2)

        var h2 = document.createElement('h2')
        h2.innerHTML = '<i style="margin-right: 5px" class="fa-regular fa-star"></i>'
        var span = document.createElement('span')
        span.innerHTML = meanScore
        h2.appendChild(span)
        infos_div.appendChild(h2)

        var description_div = document.createElement('div')
        description_div.classList.add('description')
        description_div.innerHTML = description


        content_div.appendChild(title_h1)
        content_div.appendChild(infos_div)
        content_div.appendChild(description_div)        
        entry_div.appendChild(cover_div)
        entry_div.appendChild(content_div)

        return entry_div
    }
    
    /**
     * Trigger to display the anime modal page opened from the main search section
     * 
     * @param {*} event
     * @deprecated
     */
    triggerMainSearchAnime(event) {
        if(!(event.target.classList.contains('search-entry'))) {
            var entry = event.target.closest('.search-entry')
            if(entry) {
                this.displayAnimePage(entry.id.slice(19))
            }
        } else {
            this.displayAnimePage(event.target.id.slice(19))
        }
    }

    /**
     * Displays an anime section (with anime entries from viewer lists)
     * 
     * @param {*} entries 
     * @param {*} list the viewer list (current, completed...)
     * @returns -1 if entries is empty
     */
    displayUserAnimeSection(entries, list, needProgressBar) {
        if(Object.values(entries).length == 0) return -1
        
        var anime_list_div = document.getElementById(list)
        anime_list_div.innerHTML = ""
        
        Object.keys(entries).forEach(key => {
            var anime_entry_div = this.createAnimeSectionEntry(entries[key].media)
            
            if(needProgressBar) {
                // append a shadow layer to the card
                let anime_cover_div = anime_entry_div.getElementsByClassName('anime-cover')[0]
                let anime_cover_shadow = document.createElement('div')
                anime_cover_shadow.classList.add('anime-cover-shadow')
                anime_cover_div.appendChild(anime_cover_shadow)
                
                // append the progress bar to the card
                this.appendProgressBar(
                    anime_entry_div.getElementsByClassName('anime-cover')[0],
                    parseInt(this.getEpisodes(entries[key].media)),
                    parseInt(entries[key].progress)
                    )
                }
            anime_list_div.appendChild(anime_entry_div)
        })

        this.assignZIndexToAnimeEntries(`${list}-section`)
    }
    
    /**
     * Displays an anime section (with anime entries from genres)
     * 
     * @param {*} entries
     * @param {*} genre
     */
    displayGenreAnimeSection(entries, genre) {
        
        var anime_list_div = document.getElementById(genre)
        anime_list_div.innerHTML = ""
        
        Object.keys(entries.media).forEach(key => {
            var anime_entry_div = this.createAnimeSectionEntry(Object.values(entries.media)[key])
            
            anime_list_div.appendChild(anime_entry_div)
        })
        
        this.assignZIndexToAnimeEntries(`${genre}-section`)
    }
    
    /**
     * Appends a bar showing the user progress
     * 
     * @param {*} div 
     * @param {*} episodes 
     * @param {*} progress 
     */
    appendProgressBar(div, episodes, progress) {
        var progressWidth = 100 * progress / episodes
        let bar_div = document.createElement('div')
        let progress_bar_div = document.createElement('div')
        
        bar_div.classList.add('bar')
        progress_bar_div.classList.add('progress-bar')
        progress_bar_div.style.width = `${progressWidth}%`

        bar_div.appendChild(progress_bar_div)
        div.appendChild(bar_div)
    }

    /**
     * Appends a stars row showing the user score
     * 
     * @param {*} div 
     * @param {*} score 
     */
    appendScoreStars(div, score) {
        const max = 10

        for(let i=1; i<=max; i+=2) {
            if(i < score) {
                div.innerHTML += '<i style="margin-right: 5px" class="fa-solid fa-star"></i>'
            } else if(i === score) {
                div.innerHTML += '<i style="margin-right: 5px" class="fa-regular fa-star-half-stroke"></i>'
            } else {
                div.innerHTML += '<i style="margin-right: 5px" class="fa-regular fa-star"></i>'
            }
        }
    }
    
    /**
     * Creates the anime section entry div
     * 
     * @param {*} animeEntry 
     * @returns anime entry DOM element
     */
    createAnimeSectionEntry(animeEntry) {
        const animeId = animeEntry.id
        const animeName = this.getTitle(animeEntry)
        const startYear = animeEntry.startDate.year
        const episodes = this.getAvailableEpisodes(animeEntry)
        const cover = animeEntry.coverImage.large
        
        let anime_entry_div = document.createElement('div')
        let anime_cover_div = document.createElement('div')
        let anime_cover_img = document.createElement('img')
        let anime_title_div = document.createElement('div')
        let anime_info_div = document.createElement('div')
        let startYear_div = document.createElement('div')
        let episodes_div = document.createElement('div')
        let anime_entry_content = document.createElement('div')

        anime_entry_div.classList.add('anime-entry')
        anime_cover_div.classList.add('anime-cover')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        startYear_div.classList.add('startYear')
        episodes_div.classList.add('episodes')
        anime_entry_content.classList.add('content')
        
        anime_entry_div.id = ('anime-entry-' + animeId)
        anime_title_div.innerHTML = animeName
        startYear_div.innerHTML = `<i style="margin-right: 5px" class="fa-regular fa-calendar"></i>`
        startYear_div.innerHTML += startYear
        episodes_div.innerHTML = episodes
        episodes_div.innerHTML += `<i style="margin-left: 5px" class="fa-solid fa-list-ul"></i>`
        anime_cover_img.src = cover
        anime_cover_img.alt = 'cover'
        
        let overlay_div = this.createEntryOverlay(animeEntry)

        anime_cover_div.appendChild(anime_cover_img)
        anime_entry_content.appendChild(anime_title_div)
        anime_info_div.appendChild(startYear_div)
        anime_info_div.appendChild(episodes_div)
        anime_entry_content.appendChild(anime_info_div)
        anime_entry_div.appendChild(overlay_div)
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(anime_entry_content)

        anime_entry_div.classList.add('show')
        return anime_entry_div
    }
    
    createEntryOverlay(animeEntry) {
        let overlay_div = document.createElement('div')
        let img_wrapper_div = document.createElement('div')
        let img_div = document.createElement('img')
        let content_div = document.createElement('div')
        let title_div = document.createElement('div')
        let info_div = document.createElement('div')
        let description_div = document.createElement('div')

        const banner = animeEntry.bannerImage
        const title = this.getTitle(animeEntry)
        const description = this.parseDescription(animeEntry.description)

        overlay_div.classList.add('overlay')
        img_wrapper_div.classList.add('ov-img-wrapper')
        content_div.classList.add('ov-content')
        title_div.classList.add('ov-title')
        info_div.classList.add('ov-info')
        description_div.classList.add('ov-description')

        img_div.src = banner
        title_div.innerHTML = title
        description_div.innerHTML = description

        img_wrapper_div.appendChild(img_div)
        content_div.appendChild(title_div)
        content_div.appendChild(info_div)
        content_div.appendChild(description_div)
        overlay_div.appendChild(img_wrapper_div)
        overlay_div.appendChild(content_div)

        return overlay_div
    }

    /**
     * Trigger to display the anime overlay
     * 
     * @param {*} event 
     */
    triggerAnimeOverlay(event) {
        let showOrHideOverlay = (entry) => {
            if(entry.querySelector('.overlay') === null) return

            let overlay_div = entry.querySelector('.overlay')
            let oldIndex = parseInt(entry.style.zIndex)
            console.log(oldIndex)
            oldIndex += 2
            
            // entry.style.zIndex = oldIndex
            
            overlay_div.classList.add('show-overlay')
            overlay_div.classList.add('show-overlay-delay')

            overlay_div.addEventListener('mouseout', () => {
                let oldIndex = parseInt(entry.style.zIndex)
                console.log(oldIndex)
                oldIndex -= 2
                
                // entry.style.zIndex -= oldIndex

                overlay_div.classList.remove('show-overlay')
                overlay_div.classList.remove('show-overlay-delay')
            })
        }

        if(!(event.target.classList.contains('anime-entry'))) {
            var entry = event.target.closest('.anime-entry')
            if(entry) {
                showOrHideOverlay(entry)
            }
        } else {
            // showOrHideOverlay(event.target)
        }
    }

    /**
     * Trigger to display the anime modal page opened from the featured section
     * 
     * @param {*} event 
     */
    triggerFeaturedAnime(event) {
        if(!(event.target.tagName == 'button')) {
            var entry = event.target.closest('button')
            if(entry) {
                this.displayAnimePage(entry.id.slice(22))
            }
        } else {
            this.displayAnimePage(event.target.id.slice(22))
        }
    }

    /**
     * Displays the featured anime
     * 
     * @param {*} animeEntry
     */
    displayFeaturedAnime(entries) {
        var featured_scroller_wrapper_div = document.getElementsByClassName('featured-scroller-wrapper')[0]
        var width = 0

        featured_scroller_wrapper_div.innerHTML = ''
        entries.media.forEach(key => {
            var featured_div = this.createAnimeFeaturedEntry(key)
            if(featured_div != -1) {
                featured_scroller_wrapper_div.appendChild(featured_div)
                width += 100
            }
        })

        featured_scroller_wrapper_div.style.width = (width + '%')
    }

    /**
     * Create a featured anime entry
     * 
     * @param {*} animeEntry 
     * @returns featured anime entry div | -1 if no banner is present
     */
    createAnimeFeaturedEntry(animeEntry) {
        const banner = animeEntry.bannerImage
        if(banner == null) return -1 // if there is no banner, do not display this anime

        const id = animeEntry.id
        const title = this.getTitle(animeEntry)
        const episodes = this.getEpisodes(animeEntry)
        const season = this.capitalizeFirstLetter(animeEntry.season)
        const seasonYear = animeEntry.seasonYear
        const description = this.parseDescription(animeEntry.description)

        var featured_div = document.createElement('div')
        var featured_container_div = document.createElement('div')
        var featured_img_div = document.createElement('div')
        var featured_img = document.createElement('img')
        var content_div = document.createElement('div')
        var anime_title_div = document.createElement('div')
        var anime_info_div = document.createElement('div')
        var anime_description_div = document.createElement('div')
        var featured_anime_button = document.createElement('button')
        var anime_year_div = document.createElement('div')
        var anime_episodes_div = document.createElement('div')
        
        featured_div.classList.add('featured')
        featured_container_div.classList.add('featured-container')
        featured_img_div.classList.add('featured-img')
        content_div.classList.add('content')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        anime_description_div.classList.add('anime-description')
        anime_year_div.classList.add('anime-year')
        anime_episodes_div.classList.add('anime-episodes')
        featured_anime_button.id = 'featured-anime-button-'
        featured_anime_button.id += id
        featured_anime_button.innerHTML = 'See More'
        featured_anime_button.classList.add('main-button-0')
        anime_title_div.innerHTML = title
        anime_year_div.innerHTML = season + ' ' + seasonYear
        anime_episodes_div.innerHTML = episodes + " Episodes"
        anime_description_div.innerHTML = description
        featured_img.src = banner
        
        anime_info_div.appendChild(anime_year_div)
        anime_info_div.appendChild(anime_episodes_div)
        content_div.appendChild(anime_info_div)
        content_div.appendChild(anime_title_div)
        content_div.appendChild(anime_description_div)
        content_div.appendChild(featured_anime_button)
        featured_container_div.appendChild(content_div)
        featured_div.appendChild(featured_container_div)
        featured_img_div.appendChild(featured_img)
        featured_div.appendChild(featured_img_div)
        
        content_div.classList.add('show')

        return featured_div
    }

    /**
     * Displays the viewer avatar
     * 
     * @param {*} userInfo 
     */
    displayViewerAvatar(userInfo) {
        document.getElementById('user-icon').src = userInfo.User.avatar.large
        /* document.getElementById('user-name').innerHTML += userInfo.User.name */
    }

    /**
     * Trigger to display the anime modal page opened from an anime section
     * 
     * @param {*} event 
     */
    triggerAnimeEntry(event) {
        if(!(event.target.classList.contains('anime-entry'))) {
            var entry = event.target.closest('.anime-entry')
            if(entry) {
                this.displayAnimePage(this.getIdFromAnimeEntry(entry))
            }
        } else {
            this.displayAnimePage(this.getIdFromAnimeEntry(event.target))
        }
    }

    /**
     * Displays the anime modal page
     * 
     * @param {*} animeId 
    */
   async displayAnimePage(animeId) {
        if(animeId == -1) return

        this.showModalPage('anime-page-shadow-background', 'anime-page')

        // get infos
        const anilist = new AniListAPI(clientData)
        const animeEntry = await anilist.getAnimeInfo(animeId)

        const description = animeEntry.description
        const status = animeEntry.status
        const startDate = this.months[animeEntry.startDate.month] + " " + animeEntry.startDate.day + ", "  + animeEntry.startDate.year
        const cover = animeEntry.coverImage.extraLarge
        const color = animeEntry.coverImage.color
        const banner = animeEntry.bannerImage
        const genres = animeEntry.genres
        const seasonYear = animeEntry.seasonYear
        const format = animeEntry.format
        const duration = animeEntry.duration
        const meanScore = animeEntry.meanScore
        const title = this.getTitle(animeEntry)
        const animeTitles = this.getTitlesAndSynonyms(animeEntry)
        const episodes = this.getEpisodes(animeEntry)
        const availableEpisodes = this.getAvailableEpisodes(animeEntry)
        const userStatus = this.getUserStatus(animeEntry)
        const score = this.getScore(animeEntry)
        const progress = this.getProgress(animeEntry)
        var endDate
        animeEntry.endDate.year == null
        ? endDate = '?'
        : endDate = this.months[animeEntry.endDate.month] + " " + animeEntry.endDate.day + ", "  + animeEntry.endDate.year
        
        // display infos
        var list_updater_button = document.getElementById('page-anime-list-editor')
        if(animeEntry.mediaListEntry == null) {
            list_updater_button.innerHTML = '<i class="fa-solid fa-plus"></i>'
        } else {
            list_updater_button.innerHTML = '<i class="fa-solid fa-check"></i>'
            list_updater_button.classList.add('in-list')
        }

        document.getElementById('page-anime-title').innerHTML = title
        document.getElementById('page-anime-seasonYear').innerHTML = seasonYear
        document.getElementById('page-anime-format').innerHTML = format
        document.getElementById('page-anime-duration').innerHTML = (duration + ' Min/Ep')
        document.getElementById('page-anime-meanScore').innerHTML =  meanScore
        document.getElementById('page-anime-description').innerHTML = description
        this.appendProgressBar(document.getElementById('page-anime-progress-episodes'), episodes, progress)
        this.appendScoreStars(document.getElementById('page-anime-user-score'), score)
        document.getElementById('page-anime-user-status').innerHTML = userStatus
        document.getElementById('page-anime-status').innerHTML = status
        document.getElementById('page-anime-startDate').innerHTML = startDate
        document.getElementById('page-anime-endDate').innerHTML = endDate
        document.getElementById('page-anime-cover').src = cover
        document.getElementById('page-anime-id').innerHTML = animeId
        document.getElementById('page-anime-progress').innerHTML = progress
        document.getElementById('page-anime-score-number').innerHTML = score
        document.getElementById('page-anime-episodes').innerHTML = episodes
        document.getElementById('page-anime-available-episodes').innerHTML = availableEpisodes
        
        var anime_titles_div = document.getElementById('page-anime-titles')
        Object.keys(animeTitles).forEach( (key) => {
            let h2 = document.createElement('h2')
            h2.innerHTML = animeTitles[key]
            anime_titles_div.appendChild(h2)
        })

        var episodes_list_div = document.getElementById('page-anime-episodes-list')
        for(let i=0; i<availableEpisodes; i++) {
            let episode_div = this.createEpisode(i, banner)
            episodes_list_div.appendChild(episode_div)
        }
        
        // start watching / resume / rewatch button
        var watch_button = document.querySelector(`button[id^="page-anime-watch-"]`)
        progress == episodes
        ? watch_button.id += 1
        : watch_button.id += (progress + 1)
        watch_button.innerHTML = '<i style="margin-right: 5px" class="fa-solid fa-play"></i>'

        progress == 0
        ? watch_button.innerHTML += 'Start watching' 
        : progress == episodes ? watch_button.innerHTML += 'Rewatch' 
        : watch_button.innerHTML += 'Resume episode ' + (progress+1) 

        if(availableEpisodes == '?') {
            watch_button.innerHTML = '<i style="margin-right: 5px" class="fa-solid fa-ban"></i>'
            watch_button.innerHTML += 'Not released'
        }
        
        var anime_genres_ul = document.getElementById('page-anime-genres')
        Object.keys(genres).forEach( (key) => {
            var anime_genres_li = document.createElement('li')
            anime_genres_li.innerHTML += genres[key]
            anime_genres_ul.appendChild(anime_genres_li)
        })

        // hide loader - show content
        document.getElementById('page-anime-loader').style.display = 'none'
        document.getElementById('page-anime-content-wrapper').style.display = 'flex'
    }

    /**
     * Return if the anime page is displayed or not
     * 
     * @returns true if the anime page is displayed, false otherwise
     */
    isAnimePageDisplayed() {
        return document.getElementById('anime-page').style.display == 'flex'
    }

    /**
     * Return if the list editor page is displayed or not
     * 
     * @returns true if the list editor page is displayed, false otherwise
     */
    isListEditorDisplayed() {
        return document.getElementById('list-editor-page').style.display == 'flex'
    }

    /**
     * Return if the settings page is displayed or not
     * 
     * @returns true if the settings page is displayed, false otherwise
     */
    isSettingsPageDisplayed() {
        return document.getElementById('settings-page').style.display == 'flex'
    }
    
    /**
     * List editor: you can create or change a entry status, progress and score in one of your lists
     * 
     * @returns if some form inputs are incorrect
     */
    listEditor() {
        const availableEpisodes = parseInt(document.getElementById('page-anime-available-episodes').innerHTML)
        let warn = 0
        
        let userList = document.getElementById('list-editor-user-list')
        if(userList.value == "") {
            let userListContainer = document.getElementById('list-editor-user-list-container')
            this.listEditorWarn(userListContainer)
            warn = 1
        }
        
        let userProgress = document.getElementById('list-editor-progress')
        if(userProgress.value < 0 || userProgress.value > availableEpisodes) {
            let useProgressContainer = document.getElementById('list-editor-progress-container')
            this.listEditorWarn(useProgressContainer)
            warn = 1
        } else if(userProgress.value == "") {
            userProgress.value = 0
        }

        if(userList.value === "COMPLETED") {
            userProgress.value = availableEpisodes
        }
        
        let userScore = document.getElementById('list-editor-score')
        if(userScore.value < 0 || userScore.value > 10) {
            let userScoreContainer = document.getElementById('list-editor-score-container')
            this.listEditorWarn(userScoreContainer)
            warn = 1
        } else if(userScore.value == "") {
            userScore.value = 0
        }
        
        if(warn) return
        
        const animeId = parseInt(document.getElementById('page-anime-id').innerHTML)
        console.log(animeId + ' ' + 
                    userList.value + ' ' + 
                    userScore.value*10 + ' ' + 
                    userProgress.value)

        this.anilist.updateAnimeFromList(animeId,
                                         userList.value,
                                         userScore.value*10,
                                         userProgress.value)
            
        this.closeListEditorPage()
    }
        
    /**
     * If a form input is not correct, warn the user
     * 
     * @param {*} div to warn
    */
    listEditorWarn(div) {
        div.classList.remove('user-list-warn-off')
        div.classList.add('user-list-warn-on')
        
        setTimeout(() => {
            div.classList.remove('user-list-warn-on')
            div.classList.add('user-list-warn-off')
        }, 400)
    }
    
    /**
     * Closes the list editor modal page
     */
    listEditorDelete() {
        const animeId = parseInt(document.getElementById('page-anime-id').innerHTML)
        this.anilist.deleteAnimeFromList(animeId)

        this.closeListEditorPage()
    }

    /**
     * When the list editor is used, update elements on anime page
     */
    async updateAnimePageElements() {
        const animeId = document.getElementById('page-anime-id').innerHTML
        
        const anilist = new AniListAPI(clientData)
        const animeEntry = await anilist.getAnimeInfo(animeId)
        
        const episodes = this.getEpisodes(animeEntry)
        const userStatus = this.getUserStatus(animeEntry)
        const score = this.getScore(animeEntry)
        const progress = this.getProgress(animeEntry)
        
        document.getElementById('page-anime-progress-episodes').innerHTML = ""
        document.getElementById('page-anime-user-score').innerHTML = ""
        this.appendProgressBar(document.getElementById('page-anime-progress-episodes'), episodes, progress)
        this.appendScoreStars(document.getElementById('page-anime-user-score'), score)
        document.getElementById('page-anime-user-status').innerHTML = userStatus
        document.getElementById('page-anime-progress').innerHTML = progress
        document.getElementById('page-anime-score-number').innerHTML = score
    }
    
    /**
     * When the list editor is used, update elements on anime entries lists
     */
    async updateAnimeEntries() {
        const viewerId = await this.anilist.getViewerId()
        const animeStatus = document.getElementById('page-anime-user-status').innerHTML
        const entries = await this.anilist.getViewerList(viewerId, animeStatus)
        
        let my_list_div = `${animeStatus.toLowerCase()}-my-list`
        
        // reset and update lists
        document.getElementById(my_list_div).innerHTML = ""
        this.displayUserAnimeSection(entries, my_list_div, true)
        
        document.getElementById('current-home').innerHTML = ""
        const entriesCurrent = await this.anilist.getViewerList(viewerId, 'CURRENT')
        this.displayUserAnimeSection(entriesCurrent, 'current-home', true)
    }
    
    /**
     * Closes and clears the anime modal page
     */
    closeAnimePage() {
        // hide modal page
        this.hideModalPage('anime-page-shadow-background', 'anime-page')
        
        // clear infos
        document.getElementById('page-anime-title').innerHTML = ""
        document.getElementById('page-anime-title').classList.remove('anime-page-warn-on')
        document.getElementById('page-anime-title').classList.remove('anime-page-warn-off')
        document.getElementById('page-anime-description').innerHTML = ""
        document.getElementById('page-anime-cover').src = ""
        document.getElementById('page-anime-genres').innerHTML = ""
        document.getElementById('page-anime-episodes-list').innerHTML = ""
        document.getElementById('page-anime-progress-episodes').innerHTML = ""
        document.getElementById('page-anime-user-score').innerHTML = ""
        document.getElementById('page-anime-user-status').innerHTML = ""
        document.getElementById('page-anime-status').innerHTML = ""
        document.getElementById('page-anime-startDate').innerHTML = ""
        document.getElementById('page-anime-endDate').innerHTML = ""
        document.getElementById('page-anime-titles').innerHTML = ""
        document.getElementById('page-anime-id').innerHTML = ""
        document.getElementById('page-anime-progress').innerHTML = ""
        document.getElementById('page-anime-episodes').innerHTML = ""
        document.getElementById('page-anime-available-episodes').innerHTML = ""
        document.getElementById('page-anime-score-number').innerHTML = ""
        document.getElementById('page-anime-seasonYear').innerHTML = ""
        document.getElementById('page-anime-format').innerHTML = ""
        document.getElementById('page-anime-duration').innerHTML = ""
        document.getElementById('page-anime-meanScore').innerHTML = ""
        document.getElementById('page-anime-list-editor').classList.remove('in-list')
        document.querySelector(`button[id^="page-anime-watch-"]`).id = 'page-anime-watch-'


        // hide content - show loader
        document.getElementById('page-anime-content-wrapper').style.display = 'none'
        setTimeout(() => {
            document.getElementById('page-anime-loader').style.display = 'flex'
        }, 400) // with timeout because a visual bug occurs when the modal page is closing
    }

    /**
     * Creates the episode div, provided with unique id
     * 
     * @param {*} episodeNumber
     * @param {*} banner
     * @returns episode div DOM element
     */
    createEpisode(episodeNumber, banner) {
        var episode_div = document.createElement('div')
        var episode_content_div = document.createElement('div')
        var h3 = document.createElement('h3')

        episode_div.classList.add('episode')
        episode_div.id = 'episode-' + (episodeNumber+1)
        episode_div.style.backgroundImage = `url(${banner})`
        episode_content_div.classList.add('content')
        h3.innerHTML = 'Episode ' + (episodeNumber+1)
        
        episode_div.classList.add('show')
        episode_content_div.appendChild(h3)
        episode_div.appendChild(episode_content_div)

        return episode_div
    }

    /**
     * Trigger for the video played from the episode div list
     * 
     * @param {*} event 
     */
    triggerEpisode(event) {
        if(!(event.target.classList.contains('episode'))) {
            var entry = event.target.closest('.episode')
            if(entry) {
                this.video.displayVideo(this.getIdFromAnimeEntry(entry))
            }
        } else {
            this.video.displayVideo(this.getIdFromAnimeEntry(event.target))
        }
    }

    /**
     * Returns the anime entry id
     * 
     * @param {*} div 
     * @returns 
     */
    getIdFromAnimeEntry = div => div.id.slice(12)
    
    /**
     * Returns the featured anime id
     * 
     * @param {*} div 
     * @returns 
     */
    getIdFromFeaturedAnime = div => div.id.slice(22)

    /**
     * Gets the anime title (english or romaji)
     * 
     * @param {*} animeEntry 
     * @returns title
     */
    getTitle = animeEntry => animeEntry.title.english == null
                             ? animeEntry.title.romaji
                             : animeEntry.title.english

    /**
     * Gets english, romaji and synonyms and combines them into an array
     * 
     * @param {*} animeEntry 
     * @returns anime titles
     */
    getTitlesAndSynonyms(animeEntry) {
        let animeTitles = []

        if(animeEntry.title.romaji != null) animeTitles.push(animeEntry.title.romaji)
        if(animeEntry.title.english != null) animeTitles.push(animeEntry.title.english)

        animeTitles = animeTitles.concat(Object.values(animeEntry.synonyms))

        return animeTitles
    }

    /**
     * Gets the anime episodes number from 'episodes' or 'nextAiringEpisode'
     * 
     * @param {*} animeEntry 
     * @returns episodes number
     */
    getEpisodes = animeEntry => animeEntry.episodes == null
                                ? (animeEntry.nextAiringEpisode == null
                                    ? '?'
                                    : animeEntry.nextAiringEpisode.episode - 1)
                                : animeEntry.episodes

    /**
     * Gets the anime available episodes number from 'episodes' or 'nextAiringEpisode'
     * 
     * @param {*} animeEntry 
     * @returns available episodes number
     */
    getAvailableEpisodes = animeEntry => animeEntry.nextAiringEpisode == null
                                         ? (animeEntry.episodes == null)
                                            ? '?'
                                            : animeEntry.episodes
                                         : animeEntry.nextAiringEpisode.episode - 1

    /**
     * Gets the anime user status
     * 
     * @param {*} animeEntry 
     * @returns user status
     */
    getUserStatus = animeEntry => animeEntry.mediaListEntry == null
                                  ? 'NOT IN LIST'
                                  : animeEntry.mediaListEntry.status

    /**
     * Gets the user anime score
     * 
     * @param {*} animeEntry 
     * @returns anime score
     */
    getScore = animeEntry => animeEntry.mediaListEntry == null
                             ? ""
                             : animeEntry.mediaListEntry.score

    /**
     * Gets the user anime progress
     * 
     * @param {*} animeEntry 
     * @returns anime progress
     */
    getProgress = animeEntry => animeEntry.mediaListEntry == null
                                ? "" 
                                : animeEntry.mediaListEntry.progress

    /**
     * Removes unwanted spaces/new lines from anime description
     * 
     * @param {*} description 
     * @returns parsed description
     */
    parseDescription = description => description.replace('<br>', '')

    /**
     * Capitalizes the first letter of a string
     * 
     * @param {*} string 
     * @returns parsed string
     */
    capitalizeFirstLetter = string => string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1)
}
