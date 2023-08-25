'use-strict'

const Hls = require('hls.js')
const AniListAPI = require ('../anilistApi')
const AnimeSaturn = require('../providers/animesaturn')
const clientData = require ('../clientData.js')

module.exports = class htmlManipulation {
    constructor() {
        this.cons = new AnimeSaturn()
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

    displayAnimeSection(entriesCurrent) {
        Object.keys(entriesCurrent).forEach( key => {
            this.appendAnimeEntry(entriesCurrent[key], 'CURRENT', key)
        })
    }

    appendAnimeEntry(animeEntry, status, key) {
        let anime_list_div = document.getElementById(status.toLowerCase())
        let anime_entry_div = this.createAnimeEntry(animeEntry, key)
        
        anime_list_div.appendChild(anime_entry_div)
        anime_entry_div.classList.add('show')
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
        const id = animeEntry.id
        const title = animeEntry.title.romaji
        const episodes = animeEntry.episodes
        const startYear = animeEntry.startDate.year
        const banner = animeEntry.bannerImage
        const genres = animeEntry.genres
        var anime_genres_div = document.getElementById('featured-anime-genres')
        
        document.querySelectorAll('button[id^="featured-anime-button-"]')[0].id += id
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
        document.getElementById('featured-content').classList.add('show')
        
    }

    displayUserAvatar(userInfo) {
        document.getElementById('user-icon').src = userInfo.User.avatar.large
    }

    triggerAnimeEntry(event) {
        if(!(event.target.classList.contains('anime-entry'))) {
            const entry = event.target.closest('.anime-entry')
            if(entry) {
                this.displayAnimePage(entry.id.slice(12))
            }
        } else {
            this.displayAnimePage(event.target.id.slice(12))
        }
    }

    // anime page creation
    async displayAnimePage(animeId) {
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

        var episodes
        animeEntry.episodes == null ? 
        episodes = animeEntry.nextAiringEpisode.episode - 1 : 
        episodes = animeEntry.episodes

        const cover = animeEntry.coverImage.extraLarge
        const banner = animeEntry.bannerImage
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

        // episodes
        const episodes_list_div = document.getElementById('page-anime-episodes-list')
        
        for(let i=0; i<episodes; i++) {
            let episode_div = this.createEpisodeDiv(i, banner)
            episodes_list_div.appendChild(episode_div)
        }
        
        /* const videoSrc = await this.cons.getEpisodeUrl(title, 1)
        this.playVideoFiles(videoSrc) */

        document.getElementById('anime-page').classList.add('show-page')
        document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    }

    createEpisodeDiv(i, banner) {
        let episode_div = document.createElement('div')
        episode_div.classList.add('episode')
        episode_div.id = 'episode-' + (i+1)
        episode_div.style.backgroundImage = `url(${banner})`

        let episode_content_div = document.createElement('div')
        episode_content_div.classList.add('content')
        
        let h3 = document.createElement('h3')
        h3.innerHTML = 'Episode ' + (i+1)

        episode_content_div.appendChild(h3)
        episode_div.appendChild(episode_content_div)

        return episode_div
    }

    triggerEpisode(event) {
        if(!(event.target.classList.contains('episode'))) {
            const entry = event.target.closest('.episode')
            if(entry) {
                this.displayVideo(entry.id)
            }
        } else {
            this.displayVideo(event.target.id)
        }
    }

    displayVideo(episodeId) {
        console.log(episodeId)
    }

    closeAnimePage() {
        console.log('pressed')
        document.getElementById('page-anime-title').innerHTML = ""
        /* document.getElementById('page-anime-id').innerHTML = "" */
        document.getElementById('page-anime-description').innerHTML = ""
        document.getElementById('page-anime-status').innerHTML = ""
        document.getElementById('page-anime-startDate').innerHTML = ""
        document.getElementById('page-anime-endDate').innerHTML = ""
        document.getElementById('page-anime-cover').src = ""
        document.getElementById('page-anime-genres').innerHTML = ""
        document.getElementById('page-anime-episodes-list').innerHTML = ""

        /* document.getElementById('anime-page').classList.add('close-page') */
        document.getElementById('anime-page').style.display = 'none'

        document.getElementsByTagName('body')[0].style.overflow = 'auto'
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

    // play m3u8 files
    playVideoFiles(videoSrc) {
        var video = document.getElementById('video')

        if(Hls.isSupported()) {
            var hls = new Hls()
            hls.loadSource(videoSrc)
            hls.attachMedia(video)
            /* video.play() */
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc
            video.addEventListener('loadedmetadata',function() {
            /* video.play() */
            })
        }
    }
}