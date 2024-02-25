'use-strict'

const Hls = require('hls.js')
const Store = require('electron-store')
const Gogoanime = require('../providers/gogoanime')
const AnimeSaturn = require('../providers/animesaturn')
const AniListAPI = require('../anilist/anilistApi')
const animeCustomTitles = require('../animeCustomTitles')

/**
 * Methods for video playing and functionalities
 * 
 * @class
*/
module.exports = class Video {
    
    /**
     * @constructor
     */
    constructor() {
        this.store = new Store()
        this.anilist = new AniListAPI()

        this.body = document.querySelector('body')
        this.container = document.querySelector(".container")
        this.videoElement = document.getElementById('video')
        this.videoSource = this.videoElement.src
        this.videoTitle = document.getElementById('video-title')
        this.videoEpisodeTitle = document.getElementById('video-episode-title')
        this.videoEpisode = document.getElementById('video-episode')

        // pause info
        this.pauseInfoAnimeTitle = document.getElementById('pause-info-anime-title')
        this.pauseInfoEpisodeTitle = document.getElementById('pause-info-episode-title')
        this.pauseInfoEpisodeDescription = document.getElementById('pause-info-episode-description')

        // dynamic settings options
        this.dynamicSettingsLanguage = document.getElementById('dynamic-settings-language')
        this.dynamicSettingsDubbed = document.getElementById('dynamic-settings-dubbed')
        this.dynamicSettingsUpdateProgress = document.getElementById('dynamic-settings-update-progress')
    }

    /**
     * Get the language in which the episodes will be played
     * 
     * @returns the respective Object to the streaming source
     */
    getSourceFlagObject() {
        switch(this.store.get('source_flag')) {
            case 'US': {
                return new Gogoanime()
            }
            case 'IT': {
                return new AnimeSaturn()
            }
            default: {
                return null
            }
        }
    }

    /**
     * Get the anime titles (title and synonyms) from modal anime page div
     * 
     * @param {*} animeId 
     * @returns 
     */
    getParsedAnimeTitles() {
        let animeTitles = []
        let anime_titles_div = document.querySelectorAll(`#persistent-data-common .persdata-anime-titles p`)

        Object.keys(anime_titles_div).forEach(key => {
            let title = Object.values(anime_titles_div)[key].innerHTML

            animeTitles.push(title)
            
            if(title.includes('Season ')) 
                animeTitles.push(title.replace('Season ', ''))
            if(title.includes('Season ') && title.includes('Part ')) 
                animeTitles.push(title.replace('Season ', '').replace('Part ', ''))
            if(title.includes('Part ')) 
                animeTitles.push(title.replace('Part ', ''))
            if(title.includes(':')) 
                animeTitles.push(title.replace(':', ''))
        })

        return animeTitles
    }

    /**
     * Loads video dynamic settings options
     */
    displayDynamicSettingsOptions() {
        this.dynamicSettingsLanguage.value = this.store.get('source_flag')

        this.store.get('dubbed') == true
            ? this.dynamicSettingsDubbed.checked = true
            : this.dynamicSettingsDubbed.checked = false

        this.store.get('update_progress')
            ? this.dynamicSettingsUpdateProgress.checked = true
            : this.dynamicSettingsUpdateProgress.checked = false
    }
    
    /**
     * Displays and plays the episode video
     * 
     * @param {*} episode episode id ( `episode-${animeId}-${episodeNumber}` )
     * @param {*} time time to play the video
     */
    async displayVideo(episode, time = 0) {
        console.log(episode)
        this.container.style.display = 'block'

        const cons = this.getSourceFlagObject()
        const animeId = episode.split('-')[1]
        const episodeId = episode.split('-')[2]
        const title = document.querySelector(`#anime-page-${animeId} .content-wrapper .content .left h1.title`).innerHTML
        const episodeTitle = document.querySelector(`#anime-page-${animeId} .episode-entry#episode-${animeId}-${episodeId} .title`).innerHTML
        const episodeDescription = document.querySelector(`#anime-page-${animeId} .episode-entry#episode-${animeId}-${episodeId} .description`).innerHTML
        const animeTitles = this.getParsedAnimeTitles()
        const customTitle = animeCustomTitles[this.store.get('source_flag')][animeId]

        console.log('Looking for sources...')

        if(customTitle !== undefined) animeTitles.unshift(customTitle)

        // at do-while end videoSource will be -1 if nothing is found, otherwise the episode source
        let i = 0
        do {
            var videoSource = await cons.getEpisodeUrl(animeTitles[i], episodeId, this.store.get('dubbed'))

            videoSource != -1
            ? console.log(`%c ${animeTitles[i]} -> ${videoSource.url}`, `color: #45AD67`)
            : console.log(`%c ${animeTitles[i]}`, `color: #E5A639`)

            i++
        } while(videoSource === -1 && i < animeTitles.length)

        // play episode if source is found, otherwise hide video player
        if(videoSource !== -1) {
            this.displayDynamicSettingsOptions()

            this.videoTitle.innerHTML = title
            this.videoEpisode.innerHTML = episodeId
            this.videoEpisodeTitle.innerHTML = episodeTitle
            
            this.pauseInfoAnimeTitle.innerHTML = title
            this.pauseInfoEpisodeTitle.innerHTML = episodeTitle
            this.pauseInfoEpisodeDescription.innerHTML = episodeDescription

            this.putSource(videoSource.url, videoSource.isM3U8)
            this.videoElement.currentTime = time

            // if play an episode and immediately close the player, do not load episode
            if(this.container.style.display == 'block')
                this.videoElement.play()
        } else {
            // suppose that time is not 0 only when the video is changed inside the video player (language or dub/sub togglers)
            // so in that case, don't hide the video player
            if(time === 0)
                this.container.style.display = 'none'
        }
    }

    /**
     * Updates the anime progress (if enabled in settings)
     */
    async updateAnimeProgress() {
        const animeId = document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML
        const progress = this.videoEpisode.innerHTML

        if(this.store.get('update_progress')) {
            console.log(animeId, progress)
            this.anilist.updateAnimeProgress(animeId, progress)
        }
    }

    /**
     * While watching, plays the next episode
     * 
     * @returns if you are watching the last episode
     */
    async nextEpisode() {
        if(!this.canUpdateEpisode()) {
            console.warn('This is the last episode, You can\'t go any further!')
            return
        }

        const cons = this.getSourceFlagObject()
        const animeId = document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML
        const episodeId = parseInt(this.videoEpisode.innerHTML) + 1
        const episodeTitle = document.querySelector(`#anime-page-${animeId} .episode-entry#episode-${animeId}-${episodeId} .title`).innerHTML
        const episodeDescription = document.querySelector(`#anime-page-${animeId} .episode-entry#episode-${animeId}-${episodeId} .description`).innerHTML
        let animeTitles = this.getParsedAnimeTitles()
        const customTitle = animeCustomTitles[this.store.get('source_flag')][animeId]

        if(customTitle !== undefined) animeTitles.unshift(customTitle)

        let i = 0
        do {
            var videoSource = await cons.getEpisodeUrl(animeTitles[i], episodeId, this.store.get('dubbed'))
            i++
        } while(videoSource === -1 && i < animeTitles.length)

        this.putSource(videoSource.url, videoSource.isM3U8)
        this.videoElement.play()
        this.videoEpisode.innerHTML = episodeId
        this.videoEpisodeTitle.innerHTML = document.querySelector(`.episode-entry#episode-${animeId}-${this.videoEpisode.innerHTML} .title`).innerHTML

        this.pauseInfoEpisodeTitle.innerHTML = episodeTitle
        this.pauseInfoEpisodeDescription.innerHTML = episodeDescription
    }
    
    /**
     * Returns if you can update the episodes progress or not
     * 
     * @returns -1 if you are watching the last episode
     */
    canUpdateEpisode() {
        const animeId = document.querySelector('#persistent-data-common .persdata-anime-id').innerHTML
        const episodes = parseInt(document.querySelector(`#anime-page-${animeId} .anime-page .persistent-data .persdata-anime-available-episodes`))

        return this.videoEpisode.innerHTML != episodes 
               ? true
               : false
    }

    /**
     * Given the m3u8 video source, puts the source in the video
     * 
     * @param {*} videoSource 
     */
    putSource(url, isM3U8) {
        if(isM3U8) {
            var hls = new Hls()
        
            if(Hls.isSupported()) {
                hls.loadSource(url)
                hls.attachMedia(this.videoElement)
            } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                this.videoElement.src = url
            }
        } else {
            this.videoElement.src = url
        }
    }
}