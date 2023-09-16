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
     * Displays and plays the episode video
     * 
     * @param {*} episode 
     */
    async displayVideo(episode) {
        const cons = this.getSourceFlagObject()
        const title = document.getElementById('page-anime-title').innerHTML

        // creating array with anime title plus its synonyms
        var animeTitles = []
        var anime_titles_div = document.querySelectorAll('#page-anime-titles h2')
        Object.keys(anime_titles_div).forEach( (key) => {
            animeTitles.push(Object.values(anime_titles_div)[key].innerHTML)
            anime_titles_div[key]
        })

        // console.log('titles: ' + animeTitles)
        // console.log('playground: ')

        let i = 0
        do {
            var videoSource = await cons.getEpisodeUrl(animeTitles[i], episode)
            console.log(animeTitles[i] + ' -> ' + videoSource)
            i++
        } while(videoSource === -1 && i < animeTitles.length)

        this.videoTitle.innerHTML = title
        this.videoEpisode.innerHTML = ('Episode ' + episode)

        this.putSource(videoSource)
        this.videoElement.play()
    }

    /**
     * While watching, plays the next episode
     * 
     * @returns if you are watching the last episode
     */
    async nextEpisode() {
        const cons = this.getSourceFlagObject()
        const animeId = parseInt(document.getElementById('page-anime-id').innerHTML)
        const progress = parseInt(document.getElementById('video-episode').innerHTML.slice(8))
        
        if(this.episodeElementIncrease() == -1) {
            console.warn('This is the last episode, You can\'t go any further!')
            return
        }

        if(this.store.get('update_progress')) {
            this.anilist.updateAnimeProgress(animeId, progress)
        }
        
        var videoSource = await cons.getEpisodeUrl(this.videoTitle.innerHTML,
                                                        this.getEpisodeIdFromTitle())
        /* videoSource = this.toHD(videoSource) */

        this.putSource(videoSource)
        this.videoElement.play()
    }

    /**
     * While watching, plays the previous episode
     * 
     * @returns if you are watching the first episode
     */
    async previousEpisode() {
        const cons = this.getSourceFlagObject()
        if(this.episodeElementDecrease() == -1) {
            console.warn('This is the first episode, You can\'t go back any further!')
            return
        }

        var videoSource = await cons.getEpisodeUrl(this.videoTitle.innerHTML,
                                                        this.getEpisodeIdFromTitle())
        /* videoSource = this.toHD(videoSource) */

        this.putSource(videoSource)
        this.videoElement.play()
    }

    /**
     * Temporary HD m3u8 file porter
     * @deprecated
     * @param {*} videoSource 
     * @returns video source in HD
     */
    toHD(videoSource) {
        return videoSource.slice(0, -13) + '720p/playlist_720p.m3u8'
    }

    /**
     * Increases the episode in the video controls title
     * 
     * @returns -1 if you are watching the last episode
     */
    episodeElementIncrease() {
        const episodes = parseInt(document.getElementById('page-anime-episodes').innerHTML)
        
        if(this.getEpisodeIdFromTitle() !== episodes) {
            this.videoEpisode.innerHTML = this.videoEpisode.innerHTML.slice(0, 8) + parseInt(this.getEpisodeIdFromTitle() + 1)
        } else {
            return -1
        }
    }
    
    /**
     * Decreases the episode in the video controls title
     * 
     * @returns -1 if you are watching the first episode
     */
    episodeElementDecrease() {
        if (this.getEpisodeIdFromTitle() !== 1) {
            this.videoEpisode.innerHTML = this.videoEpisode.innerHTML.slice(0, 8) + parseInt(this.getEpisodeIdFromTitle() - 1)
        } else {
            return -1
        }
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
    putSource(videoSource) {
        var hls = new Hls()
        
        if(Hls.isSupported()) {
            hls.loadSource(videoSource)
            hls.attachMedia(this.videoElement)
            this.container.style.display = 'block'
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            this.videoElement.src = videoSource
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
}