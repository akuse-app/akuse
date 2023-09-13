'use-strict'

const AniListAPI = require ('../anilist/anilistApi')
const AnimeSaturn = require('../providers/animesaturn')
const Video = require('./video')
const clientData = require ('../clientData.js')


/**
 * Methods to manipulate the DOM with the data fetched
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
     */
    removeLoadingPage() {
        document.getElementById('loading-page').style.opacity = 0;
        document.getElementById('loading-page').style.display = 'none';
    }

    /**
     * Toggles the user dropdown, handling animations and style changes
     */
    toggleUserDropdown() {
        var userSection = document.getElementById('user-section')
        var userDropdown = document.getElementById('user-dropdown')
        var color_1 = getComputedStyle(document.documentElement).getPropertyValue('--color-1');

        if(userDropdown.style.display == 'none') {
            userSection.style.backgroundColor = color_1
            userDropdown.style.display = 'block'
            userDropdown.classList.remove('hide-user-dropdown')
            userDropdown.classList.add('show-user-dropdown')
        } else {
            userSection.style.backgroundColor = 'transparent'
            userDropdown.classList.remove('show-user-dropdown')
            userDropdown.classList.add('hide-user-dropdown')
            setTimeout(() => {
                userDropdown.style.display = 'none'
            }, 400)
        }
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
     * Clears the div with the searched animes
     */
    clearSearchedAnimes() {
        document.getElementById('main-search-list').innerHTML = ''
    }

    openMainSearchBar() {
        var searchMainDiv = document.getElementById('main-search-list-container')
        var searchMainInput = document.getElementById('search-main-input')

        searchMainDiv.style.display = 'flex'
        searchMainInput.focus()
    }

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
        const cover = animeEntry.coverImage.extraLarge
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
     * Trigger for displaying the anime modal page opened from the main search section
     * 
     * @param {*} event 
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
     */
    displayUserAnimeSection(entries, list, needProgressBar) {
        var anime_list_div = document.getElementById(list)

        Object.keys(entries).forEach(key => {
            var anime_entry_div = this.createAnimeSectionEntry(entries[key].media)

            if(needProgressBar) {
                this.appendProgressBar(
                    anime_entry_div.getElementsByClassName('anime-cover')[0],
                    parseInt(this.getEpisodes(entries[key].media)),
                    parseInt(entries[key].progress)
                )
            }
            anime_list_div.appendChild(anime_entry_div)
        })
    }
    
    /**
     * Displays an anime section (with anime entries from genres)
     * 
     * @param {*} entries
     * @param {*} genre
     */
    displayGenreAnimeSection(entries, genre) {
        var anime_list_div = document.getElementById(genre)
        Object.keys(entries.media).forEach(key => {
            var anime_entry_div = this.createAnimeSectionEntry(Object.values(entries.media)[key])
            anime_list_div.appendChild(anime_entry_div)
        })
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
        progress_bar_div.style.width = `${progressWidth}%` // TODO fix for when calc is needed (-20px)

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
        const cover = animeEntry.coverImage.extraLarge
    
        let anime_entry_div = document.createElement('div')
        let anime_cover_div = document.createElement('div')
        let anime_cover_img = document.createElement('img')
        let anime_title_div = document.createElement('div')
        let anime_entry_content = document.createElement('div')
        
        anime_entry_div.classList.add('anime-entry')
        anime_cover_div.classList.add('anime-cover')
        anime_title_div.classList.add('anime-title')
        anime_entry_content.classList.add('content')

        anime_entry_div.id = ('anime-entry-' + animeId)
        anime_title_div.innerHTML = animeName
        anime_cover_img.src = cover
        anime_cover_img.alt = 'cover'

        anime_cover_div.appendChild(anime_cover_img)
        anime_entry_content.appendChild(anime_title_div)
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(anime_entry_content)

        anime_entry_div.classList.add('show')
        return anime_entry_div
    }

    /**
     * Trigger for displaying the anime modal page opened from the featured section
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

        entries.media.forEach(key => {
            var featured_div = this.createAnimeFeaturedEntry(key)
            featured_scroller_wrapper_div.appendChild(featured_div)
            width += 100
        })

        featured_scroller_wrapper_div.style.width = (width + '%')
    }

    createAnimeFeaturedEntry(animeEntry) {
        const id = animeEntry.id
        const title = this.getTitle(animeEntry)
        const episodes = this.getEpisodes(animeEntry)
        const startYear = animeEntry.startDate.year
        const banner = animeEntry.bannerImage
        const description = animeEntry.description

        var featured_div = document.createElement('div')
        var featured_container_div = document.createElement('div')
        var featured_img_div = document.createElement('div')
        var featured_img = document.createElement('img')
        var featured_left_div = document.createElement('div')
        var featured_shadow_div = document.createElement('div')
        var featured_right_div = document.createElement('div')
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
        featured_left_div.classList.add('featured-left')
        featured_shadow_div.classList.add('featured-shadow')
        featured_right_div.classList.add('featured-right')
        content_div.classList.add('content')
        anime_title_div.classList.add('anime-title')
        anime_info_div.classList.add('anime-info')
        anime_description_div.classList.add('anime-description')
        anime_year_div.classList.add('anime-year')
        anime_episodes_div.classList.add('anime-episodes')
        featured_anime_button.id = 'featured-anime-button-'
        featured_anime_button.id += id
        featured_anime_button.innerHTML = 'Go to the page'
        anime_title_div.innerHTML = title
        anime_year_div.innerHTML = '<i style="margin-right: 5px" class="fa-regular fa-calendar-plus"></i>'
        anime_year_div.innerHTML += startYear
        anime_episodes_div.innerHTML = episodes + " Episodes"
        anime_description_div.innerHTML = description
        featured_img.src = banner
        
        anime_info_div.appendChild(anime_year_div)
        anime_info_div.appendChild(anime_episodes_div)
        content_div.appendChild(anime_title_div)
        content_div.appendChild(anime_info_div)
        content_div.appendChild(anime_description_div)
        content_div.appendChild(featured_anime_button)
        featured_left_div.appendChild(content_div)
        featured_container_div.appendChild(featured_left_div)
        featured_container_div.appendChild(featured_shadow_div)
        featured_container_div.appendChild(featured_right_div)
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
        document.getElementById('user-name').innerHTML += userInfo.User.name
    }

    /**
     * Trigger for displaying the anime modal page opened from an anime section
     * 
     * @param {*} event 
     */
    triggerAnimeEntry(event) {
        if(!(event.target.classList.contains('anime-entry'))) {
            var entry = event.target.closest('.anime-entry')
            if(entry) {
                this.displayAnimePage(entry.id.slice(12))
            }
        } else {
            this.displayAnimePage(event.target.id.slice(12))
        }
    }

    /**
     * Displays the anime modal page
     * 
     * @param {*} animeId 
     */
    async displayAnimePage(animeId) {
        // get infos
        const anilist = new AniListAPI(clientData)
        const animeEntry = await anilist.getAnimeInfo(animeId)

        const description = animeEntry.description
        const status = animeEntry.status
        const startDate = this.months[animeEntry.startDate.month] + " " + animeEntry.startDate.day + ", "  + animeEntry.startDate.year
        const cover = animeEntry.coverImage.extraLarge
        const banner = animeEntry.bannerImage
        const genres = animeEntry.genres
        const seasonYear = animeEntry.seasonYear
        const format = animeEntry.format
        const duration = animeEntry.duration
        const meanScore = animeEntry.meanScore
        const title = this.getTitle(animeEntry)
        const animeTitles = [title].concat(Object.values(animeEntry.synonyms))
        const episodes = this.getEpisodes(animeEntry)
        const userStatus = this.getUserStatus(animeEntry)
        const score = this.getScore(animeEntry)
        const progress = this.getProgress(animeEntry)
        var endDate
            animeEntry.endDate.year == null
            ? endDate = '?'
            : endDate = this.months[animeEntry.endDate.month] + " " + animeEntry.endDate.day + ", "  + animeEntry.endDate.year
        
        // display infos
        var list_updater_button = document.getElementById('page-anime-list-updater')
        if(animeEntry.mediaListEntry == null) {
            list_updater_button.innerHTML = '<i style="margin-right: 10px" class="fa-regular fa-bookmark"></i>'
            list_updater_button.innerHTML += 'Add to your list'
        } else {
            list_updater_button.innerHTML = '<i style="margin-right: 10px" class="fa-solid fa-bookmark"></i>'
            list_updater_button.innerHTML += 'In list'
        }

        document.getElementById('page-anime-title').innerHTML = title
        document.getElementById('page-anime-seasonYear').innerHTML = seasonYear
        document.getElementById('page-anime-format').innerHTML = format
        document.getElementById('page-anime-duration').innerHTML = (duration + ' Min/Ep')
        document.getElementById('page-anime-meanScore').innerHTML =  meanScore
        document.getElementById('page-anime-description').innerHTML = description
        /* document.getElementById('page-anime-progress-episodes').innerHTML = (progress + ' / ' + episodes) */
        this.appendProgressBar(document.getElementById('page-anime-progress-episodes'), episodes, progress)
        /* document.getElementById('page-anime-user-score').innerHTML = (score + ' / 10') */
        this.appendScoreStars(document.getElementById('page-anime-user-score'), score)
        document.getElementById('page-anime-user-status').innerHTML = userStatus
        document.getElementById('page-anime-status').innerHTML = status
        document.getElementById('page-anime-startDate').innerHTML = startDate
        document.getElementById('page-anime-endDate').innerHTML = endDate
        document.getElementById('page-anime-cover').src = cover
        document.getElementById('page-anime-id').innerHTML = animeId
        document.getElementById('page-anime-progress').innerHTML = progress
        document.getElementById('page-anime-episodes').innerHTML = episodes
        
        var anime_titles_div = document.getElementById('page-anime-titles')
        Object.keys(animeTitles).forEach( (key) => {
            let h2 = document.createElement('h2')
            h2.innerHTML = animeTitles[key]
            anime_titles_div.appendChild(h2)
        })

        var episodes_list_div = document.getElementById('page-anime-episodes-list')
        
        for(let i=0; i<episodes; i++) {
            let episode_div = this.createEpisode(i, banner)
            episodes_list_div.appendChild(episode_div)
        }

        /* var anime_genres_ul = document.getElementById('page-anime-genres')
        Object.keys(genres).forEach( (key) => {
            var anime_genres_li = document.createElement('li')
            anime_genres_li.innerHTML += genres[key]
            anime_genres_ul.appendChild(anime_genres_li)
        }) */

        // show modal page
        document.getElementById('anime-page').style.display = 'flex'
        document.getElementById('anime-page-shadow-background').style.display = 'flex'

        document.getElementById('anime-page').classList.remove('hide-page')
        document.getElementById('anime-page').classList.add('show-page')
        document.getElementById('anime-page-shadow-background').classList.remove('hide-page-shadow-background')
        document.getElementById('anime-page-shadow-background').classList.add('show-page-shadow-background')
        
        document.getElementsByClassName('body-container')[0].style.overflow = 'hidden'
    }
    
    triggerListUpdater() {
        var list_updater_button = document.getElementById('page-anime-list-updater')
    }

    /**
     * Closes and clears the anime modal page
     */
    closeAnimePage() {
        // hide modal page
        document.getElementById('anime-page').classList.remove('show-page')
        document.getElementById('anime-page').classList.add('hide-page')
        document.getElementById('anime-page-shadow-background').classList.remove('show-page-shadow-background')
        document.getElementById('anime-page-shadow-background').classList.add('hide-page-shadow-background')

        setTimeout(() => {
            document.getElementById('anime-page').style.display = 'none'
            document.getElementById('anime-page-shadow-background').style.display = 'none'
        }, 400)
        
        document.getElementsByClassName('body-container')[0].style.overflow = 'auto'
        
        // enable body scrolling only if main search container isn't enabled
        /* if(document.getElementById('main-search-list-container').style.display == 'none') {
            document.getElementsByClassName('body-container')[0].style.overflow = 'auto'
        } */

        // clear infos
        document.getElementById('page-anime-title').innerHTML = ""
        document.getElementById('page-anime-description').innerHTML = ""
        document.getElementById('page-anime-cover').src = ""
        /* document.getElementById('page-anime-genres').innerHTML = "" */
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
        document.getElementById('page-anime-seasonYear').innerHTML = ""
        document.getElementById('page-anime-format').innerHTML = ""
        document.getElementById('page-anime-duration').innerHTML = ""
        document.getElementById('page-anime-meanScore').innerHTML = ""
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
                this.video.displayVideo(entry.id.slice(8))
            }
        } else {
            this.video.displayVideo(event.target.id.slice(8))
        }
    }

    /**
     * Checks if an DOM element is in viewport
     * 
     * @param {*} element 
     * @returns 
     */
    isInViewport(element) {
        var bounding = element.getBoundingClientRect()
    
        if (
            bounding.top >= 0 &&
            bounding.left >= 0 &&
            bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
            bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)   
        ) return true
        
        return false
    }

    /**
     * Gets the anime title (english or romaji)
     * 
     * @param {*} animeEntry 
     * @returns title
     */
    getTitle(animeEntry) {
        var title
        animeEntry.title.english == null
        ? title = animeEntry.title.romaji
        : title = animeEntry.title.english

        return title
    }

    /**
     * Gets the anime episodes number from 'episodes' or 'nextAiringEpisode'
     * 
     * @param {*} animeEntry 
     * @returns episodes number
     */
    getEpisodes(animeEntry) {
        var episodes
        animeEntry.episodes == null
        ? (animeEntry.nextAiringEpisode == null
           ? episodes = '?'
           : episodes = animeEntry.nextAiringEpisode.episode - 1)
        : episodes = animeEntry.episodes

        return episodes
    }

    /**
     * Gets the anime user status
     * 
     * @param {*} animeEntry 
     * @returns user status
     */
    getUserStatus(animeEntry) {
        var userStatus 
        animeEntry.mediaListEntry == null
        ? userStatus = 'Not in list'
        : userStatus = animeEntry.mediaListEntry.status

        return userStatus
    }

    /**
     * Gets the user anime score
     * 
     * @param {*} animeEntry 
     * @returns anime score
     */
    getScore(animeEntry) {
        var score
        animeEntry.mediaListEntry == null
        ? score = 0
        : score = animeEntry.mediaListEntry.score

        return score
    }

    /**
     * Gets the user anime progress
     * 
     * @param {*} animeEntry 
     * @returns anime progress
     */
    getProgress(animeEntry) {
        var progress
        animeEntry.mediaListEntry == null
        ? progress = 0
        : progress = animeEntry.mediaListEntry.progress

        return progress
    }
}
