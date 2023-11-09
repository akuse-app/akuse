'use-strict'

const Hls = require('hls.js')
const Store = require('electron-store')
const Gogoanime = require('../providers/gogoanime')
const AnimeSaturn = require('../providers/animesaturn')
const AniListAPI = require('../anilist/anilistApi')

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

        this.container = document.querySelector(".container")
        this.videoElement = document.getElementById('video')
        this.videoSource = this.videoElement.src
        this.videoTitle = document.getElementById('video-title')
        this.videoEpisode = document.getElementById('video-episode')
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
     * @returns anime titles
     */
    getAnimeTitles() {
        let animeTitles = []
        let anime_titles_div = document.querySelectorAll('#page-anime-titles h2')
        
        Object.keys(anime_titles_div).forEach( (key) => {
            animeTitles.push(Object.values(anime_titles_div)[key].innerHTML)
            animeTitles.push(Object.values(anime_titles_div)[key].innerHTML.replace('Season ', ''))
        })

        return animeTitles
    }
    
    /**
     * Displays and plays the episode video
     * 
     * @param {*} episode 
     */
    async displayVideo(episode) {
        const cons = this.getSourceFlagObject()
        const title = document.getElementById('page-anime-title').innerHTML
        const animeTitles = this.getAnimeTitles()

        console.log('titles: ' + animeTitles)
        console.log('playground: ')

        let i = 0
        do {
            var videoSource = await cons.getEpisodeUrl(animeTitles[i], episode)

            videoSource != -1
            ? console.log(animeTitles[i] + ' -> ' + videoSource.url)
            : console.log(animeTitles[i] + ' -> ' + -1)

            i++
        } while(videoSource === -1 && i < animeTitles.length)

        if(videoSource !== -1) {
            this.videoTitle.innerHTML = title
            this.videoEpisode.innerHTML = ('Episode ' + episode)

            this.putSource(videoSource.url, videoSource.isM3U8)
            this.videoElement.play()
        } else {
            this.animePageWarn(document.getElementById('page-anime-title'))
        }
    }

    /**
     * Updates the anime progress (if enabled in settings)
     */
    async updateAnimeProgress() {
        const animeId = parseInt(document.getElementById('page-anime-id').innerHTML)
        const progress = parseInt(document.getElementById('video-episode').innerHTML.slice(8))

        if(this.store.get('update_progress')) {
            this.anilist.updateAnimeProgress(animeId, progress)
        }
    }

    /**
     * While watching, plays the next episode
     * 
     * @returns if you are watching the last episode
     */
    async nextEpisode() {
        if(!(this.canUpdateEpisode())) {
            console.warn('This is the last episode, You can\'t go any further!')
            return
        }

        const cons = this.getSourceFlagObject()
        var animeTitles = this.getAnimeTitles()

        let i = 0
        do {
            var videoSource = await cons.getEpisodeUrl(animeTitles[i], this.getEpisodeIdFromTitle() + 1)
            i++
        } while(videoSource === -1 && i < animeTitles.length)

        this.putSource(videoSource.url, videoSource.isM3U8)
        this.videoElement.play()
        this.videoEpisode.innerHTML = this.videoEpisode.innerHTML.slice(0, 8) + parseInt(this.getEpisodeIdFromTitle() + 1)
    }
    
    /**
     * Returns if you can update the episodes progress or not
     * 
     * @returns -1 if you are watching the last episode
     */
    canUpdateEpisode() {
        const episodes = parseInt(document.getElementById('page-anime-available-episodes').innerHTML)
        if(this.getEpisodeIdFromTitle() !== episodes) {
            return true
        }

        return false
    }

    /**
     * Gets the episode id from the video controls title
     * 
     * @returns episode id
     */
    getEpisodeIdFromTitle() {
        return parseInt(this.videoEpisode.innerHTML.slice(8))
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
                this.container.style.display = 'block'
            } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                this.videoElement.src = url
                this.container.style.display = 'block'
            }
        } else {
            this.videoElement.src = url
            this.container.style.display = 'block'
        }
    }

    /**
     * Puts fullscreen and plays the video
     * @deprecated
     */
    fullscreenAndPlay(video) {
        const fullScreenBtn = container.querySelector(".fullscreen i")

        // toggle video fullscreen
        this.container.classList.toggle("fullscreen");
        if(document.fullscreenElement) {
            fullScreenBtn.classList.replace("fa-compress", "fa-expand");
            return document.exitFullscreen();
        }
        fullScreenBtn.classList.replace("fa-expand", "fa-compress");
        this.container.requestFullscreen();

        video.play()
    }

    /**
     * Highlights anime title to warn something
     * 
     * @param {*} div 
     */
    animePageWarn(div) {
        div.classList.remove('anime-page-warn-off')
        div.classList.add('anime-page-warn-on')
        
        setTimeout(() => {
            div.classList.remove('anime-page-warn-on')
            div.classList.add('anime-page-warn-off')
        }, 400)
    }
}