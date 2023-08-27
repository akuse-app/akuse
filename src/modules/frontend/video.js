'use-strict'

const Hls = require('hls.js')
const AnimeSaturn = require('../providers/animesaturn')

module.exports = class Video {
    constructor() {
        this.cons = new AnimeSaturn()

        this.container = document.querySelector(".container")
        this.videoElement = document.getElementById('video')
        this.videoSource = this.videoElement.src
        this.videoTitle = document.getElementById('video-title')
        this.videoEpisode = document.getElementById('video-episode')
    }

    async displayVideo(episode) {
        const title = document.getElementById('page-anime-title').innerHTML

        var animeTitles = []
        var anime_titles_div = document.querySelectorAll('#anime-titles h2')
        Object.keys(anime_titles_div).forEach( (key) => {
            animeTitles.push(Object.values(anime_titles_div)[key].innerHTML)
            anime_titles_div[key]
        })

        console.log(animeTitles)

        var i = 0
        do {
            var videoSource = await this.cons.getEpisodeUrl(animeTitles[i], episode)
            console.log(animeTitles[i] + ' -> ' + videoSource)
            i++
        } while(videoSource === -1)
        
        /* videoSource = this.toHD(videoSource) */

        this.videoTitle.innerHTML = title
        this.videoEpisode.innerHTML = ('Episode ' + episode)

        this.putSource(videoSource)
        this.videoElement.play()
    }

    // TO DO: remove this function
    async getVideoSource(title, episode) {
        return await this.cons.getEpisodeUrl(title, episode)
    }

    async nextEpisode() {
        if(this.episodeElementAdd() == -1) {
            console.warn('This is the last episode, You can\'t go any further!')
            return
        }

        var videoSource = await this.getVideoSource(this.videoTitle.innerHTML,
                                                    this.getEpisodeIdFromTitle())
        /* videoSource = this.toHD(videoSource) */

        this.putSource(videoSource)
        this.videoElement.play()
    }

    async previousEpisode() {
        if(this.episodeElementSubstract() == -1) {
            console.warn('This is the first episode, You can\'t go back any further!')
            return
        }

        var videoSource = await this.getVideoSource(this.videoTitle.innerHTML,
                                                    this.getEpisodeIdFromTitle())
        /* videoSource = this.toHD(videoSource) */

        this.putSource(videoSource)
        this.videoElement.play()
    }

    // temporary HD m3u8 file porter until Consumet API isn't upddated
    toHD(videoSource) {
        return videoSource.slice(0, -13) + '720p/playlist_720p.m3u8'
    }

    episodeElementAdd() {
        const episodes = parseInt(document.getElementById('page-anime-episodes').innerHTML)
        
        if(this.getEpisodeIdFromTitle() !== episodes) {
            this.videoEpisode.innerHTML = this.videoEpisode.innerHTML.slice(0, 8) + parseInt(this.getEpisodeIdFromTitle() + 1)
        } else {
            return -1
        }
    }
    
    episodeElementSubstract() {
        if (this.getEpisodeIdFromTitle() !== 1) {
            this.videoEpisode.innerHTML = this.videoEpisode.innerHTML.slice(0, 8) + parseInt(this.getEpisodeIdFromTitle() - 1)
        } else {
            return -1
        }
    }

    getEpisodeIdFromTitle() {
        return parseInt(this.videoEpisode.innerHTML.slice(8))
    }

    // given the m3u8 file source, play the video and put fullscreen
    putSource(videoSource) {
        var hls = new Hls()
        
        if(Hls.isSupported()) {
            hls.loadSource(videoSource)
            hls.attachMedia(this.videoElement)
            this.container.style.display = 'block'
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            this.videoElement.src = videoSource
            this.container.style.display = 'block'
            /* this.videoElement.addEventListener('loadedmetadata',function() {
                this.fullscreenAndPlay(this.videoElement)
            }) */
        }
    }

    // put fullscreen and change the icon
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