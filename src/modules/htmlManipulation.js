'use-strict'

const AniListAPI = require ('../modules/anilistApi')
const clientData = require ('../modules/clientData.js')

module.exports = class htmlManipulation {
    constructor() {
        this.months = {
            '1': 'Jan',
            '2': 'Feb',
            '3': 'Mar',
            '4': 'Apr',
            '5': 'May',
            '1': 'Jun',
            '7': 'Jul',
            '8': 'Aug',
            '9': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        }
    }

    displayAnimeSection(entriesCurrent) {
        Object.keys(entriesCurrent).forEach( key => {
            this.appendAnimeEntry(entriesCurrent[key], 'CURRENT', key)
        })
    }

    appendAnimeEntry(animeEntry, status, key) {
        let anime_list_div = document.getElementById(status.toLowerCase())
        let anime_entry_div = this.createAnimeEntry(animeEntry, key)
        
        anime_list_div.appendChild(anime_entry_div)
    }

    createAnimeEntry(animeEntry) {
        const animeId = animeEntry.mediaId
        const animeName = animeEntry.media.title.romaji
        const progress = animeEntry.progress
        const cover = animeEntry.media.coverImage.extraLarge
        
        var episodes
        animeEntry.media.episodes == null ? episodes = '?' : episodes = animeEntry.media.episodes
    
        let anime_entry_div = document.createElement('div')
        anime_entry_div.classList.add('anime-entry')
        
        /* let index = parseInt(key) + 1 */
        anime_entry_div.id = ('anime-entry-' + animeId)
    
        let anime_cover_div = document.createElement('img')
        anime_cover_div.classList.add('anime-cover')
        anime_cover_div.src = cover
        anime_cover_div.alt = 'cover'
    
        let anime_title_div = document.createElement('div')
        anime_title_div.classList.add('anime-title')
        anime_title_div.innerHTML = animeName
    
        let anime_progress_div = document.createElement('div')
        anime_progress_div.classList.add('anime-progress')
        anime_progress_div.innerHTML = `${progress} / ${episodes}`
    
        anime_entry_div.appendChild(anime_cover_div)
        anime_entry_div.appendChild(anime_title_div)
        anime_entry_div.appendChild(anime_progress_div)
        anime_entry_div.classList.add('fade-in')
        
        return anime_entry_div
    }

    displayFeaturedAnime(animeEntry) {
        const title = animeEntry.title.romaji
        const episodes = animeEntry.episodes
        const startYear = animeEntry.startDate.year
        const banner = animeEntry.bannerImage
        const genres = animeEntry.genres
        var anime_genres_div = document.getElementById('featured-anime-genres')
    
        document.getElementById('featured-anime-title').innerHTML = title
        document.getElementById('featured-anime-year').innerHTML = startYear
        document.getElementById('featured-anime-episodes').innerHTML = episodes + " Episodes"
    
        Object.keys(genres).forEach( (key) => {
            anime_genres_div.innerHTML += genres[key]
            if(parseInt(key) < Object.keys(genres).length - 1) {
                anime_genres_div.innerHTML += " • "
            }
        })
    
        document.getElementById('featured-img').src = banner
    }

    displayUserAvatar(userInfo) {
        document.getElementById('user-icon').src = userInfo.User.avatar.large
    }

    triggerAnimeEntry(event) {
        if(!(event.target.classList.contains('anime-entry'))) {
            const entry = event.target.closest('.anime-entry')
            if(entry) {
                this.displayAnimePage(entry.id)
            }
        } else {
            this.displayAnimePage(event.target.id)
        }
    }

    // anime page creation
    async displayAnimePage(animeEntryId) {
        const animeId = animeEntryId.slice(12) // the div id is 'anime-entry-number', so it will cut the string and keep only 'number'
        const anilist = new AniListAPI(clientData)

        document.getElementById('anime-page').style.display = 'flex'
        const animeEntry = await anilist.getAnimeInfo(animeId)

        // retrieve infos
        const title = animeEntry.title.romaji
        const id = animeEntry.id
        const description = animeEntry.description
        const status = animeEntry.status
        const startDate = this.months[animeEntry.startDate.month] + " " + animeEntry.startDate.day + ", "  + animeEntry.startDate.year

        var endDate
        animeEntry.endDate.year == null ? endDate = '?' : endDate = this.months[animeEntry.endDate.month] + " " + animeEntry.endDate.day + ", "  + animeEntry.endDate.year

        const cover = animeEntry.coverImage.extraLarge
        const genres = animeEntry.genres
        
        // put infos in page
        let page_anime_title_div = document.getElementById('page-anime-title')
        page_anime_title_div.innerHTML = title
        
        let span_id = document.createElement('span')
        span_id.innerHTML = " #" + id
        
        page_anime_title_div.appendChild(span_id)
        
        document.getElementById('page-anime-description').innerHTML = description
        document.getElementById('page-anime-status').innerHTML = status
        document.getElementById('page-anime-startDate').innerHTML = startDate
        document.getElementById('page-anime-endDate').innerHTML = endDate
        document.getElementById('page-anime-cover').src = cover
        
        var anime_genres_div = document.getElementById('page-anime-genres')
        Object.keys(genres).forEach( (key) => {
            anime_genres_div.innerHTML += genres[key]
            if(parseInt(key) < Object.keys(genres).length - 1) {
                anime_genres_div.innerHTML += " • "
            }
        })
    }

    closeAnimePage() {
        document.getElementById('page-anime-title').innerHTML = ""
        /* document.getElementById('page-anime-id').innerHTML = "" */
        document.getElementById('page-anime-description').innerHTML = ""
        document.getElementById('page-anime-status').innerHTML = ""
        document.getElementById('page-anime-startDate').innerHTML = ""
        document.getElementById('page-anime-endDate').innerHTML = ""
        document.getElementById('page-anime-cover').src = ""
        document.getElementById('page-anime-genres').innerHTML = ""

        document.getElementById('anime-page').style.display = 'none'
    }

    displayIFrame(link) {
        
    }

    searchWithBar() {
        var txtValue;
        var input = document.getElementById('search-bar');
        var filter = input.value.toLowerCase().replace(/\s/g, '');
        var items = document.getElementsByClassName('anime-title');
        var itemsCard = document.getElementsByClassName('anime-entry')

        Object.keys(items).forEach( key => {
            txtValue = items[key].textContent || a.innerText;
            if (txtValue.toLowerCase().replace(/\s/g, '').indexOf(filter) > -1) {
                itemsCard[key].style.display = "";
            } else {
                itemsCard[key].style.display = "none";
            }
        })
    }

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
}