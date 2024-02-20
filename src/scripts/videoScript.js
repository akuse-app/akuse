'use-strict'

const Video = require('../modules/frontend/video')
const Store = require('electron-store')
const video = new Video()
const store = new Store()

const container = document.querySelector(".container"),
shadowControls = document.getElementsByClassName('shadow-controls')[0],
mainVideo = document.getElementById("video"),
videoTitle = document.getElementById('video-title'),
videoEpisodeTitle = document.getElementById('video-episode-title'),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".video-progress-bar"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
nextEpisodeBtn = container.querySelector(".next")
exitBtn = document.querySelector('.exit-video')
volumeBtn = container.querySelector(".volume i"),
speedBtn = container.querySelector(".playback-speed i"),
settingsBtn = container.querySelector(".settings i"),
settingsOptions = container.querySelector(".settings-options"),
volumeRange = container.querySelector(".volume input"),
playbackSelect = container.querySelector(".playback select"),
fullScreenBtn = container.querySelector(".fullscreen i")

let timer
let updated = 0 /* to update anime progress automatically */

const setVolume = value => {
    mainVideo.volume = value;
    volumeRange.value = value;
    store.set('video-volume', value)
}

const getVolume = () => store.get('video-volume')

const setPlayback = value => {
    mainVideo.playbackRate = value
    playbackSelect.value = value
    store.set('video-playback', value)
}

const getPlayback = () => store.get('video-playback')

// stored data load
getVolume()
    ? setVolume(parseFloat(store.get('video-volume')))
    : setVolume(0.5)

if(getVolume() == 0) {
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
}

getPlayback()
    ? setPlayback(store.get('video-playback'))
    : setPlayback(1)

// controls
const hideControls = () => {
    if(settingsOptions.classList.contains("show-options")) 
        return

    timer = setTimeout(() => {
        container.classList.remove("show-controls")
        shadowControls.classList.remove('show-cursor')
    }, 2000)
}

hideControls()

// pause info
var pauseTimer
const showPauseInfo = () => {
    clearTimeout(pauseTimer)

    if(settingsOptions.classList.contains("show-options")) 
        return
    
    pauseTimer = setTimeout(() => {
        if(mainVideo.paused && mainVideo.currentTime != 0) {
            container.classList.add('show-pause-info')
        }
    }, 7500)
}

const hidePauseInfo = () => {
    container.classList.remove('show-pause-info')
}

mainVideo.addEventListener('pause', () => {
    container.addEventListener("mousemove", (event) => {
        showPauseInfo()
    });
})

mainVideo.addEventListener('pause', () => {
    showPauseInfo()
})

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls")
    shadowControls.classList.add('show-cursor')
    clearTimeout(timer)
    hideControls()
    hidePauseInfo()
})

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600)
    seconds = seconds < 10 ? `0${seconds}` : seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours
    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth
    let offsetX = e.offsetX
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration)
    const progressTime = videoTimeline.querySelector("span")
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX
    progressTime.style.left = `${offsetX}px`
    progressTime.innerText = formatTime(percent)
})

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth
    let currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
    progressBar.style.width = `${(currentTime / mainVideo.duration) * 100}%`
    mainVideo.currentTime = currentTime
})

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target
    progressBar.style.width = `${(currentTime / duration) * 100}%`
    currentVidTime.innerText = formatTime(currentTime)
})

mainVideo.addEventListener("timeupdate", () => {
    videoDuration.innerText = formatTime(mainVideo.duration - mainVideo.currentTime)
})

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth
    progressBar.style.width = `${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
    currentVidTime.innerText = formatTime(mainVideo.currentTime)
}

volumeRange.addEventListener("input", e => {
    setVolume(e.target.value)

    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
})

playbackSelect.addEventListener('change', () => {
    setPlayback(playbackSelect.value)
})

fullScreenBtn.addEventListener("click", () => {
    toggleFullScreen()
})

exitBtn.addEventListener("click", () => {
    updated = 0
    mainVideo.pause()
    mainVideo.currentTime = 0
    mainVideo.src = null
    videoTitle.innerHTML = ''
    videoEpisodeTitle.innerHTML = ''
    container.style.display = 'none'
    if(document.fullscreenEnabled) {
        document.exitFullscreen()
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")
    }
})

mainVideo.addEventListener('play', () => {
    setPlayback(getPlayback())
})

mainVideo.addEventListener("click", (event) => {
    if (event.target !== this)
        return
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
})

container.addEventListener("click", (event) => {
    // do not hide if press settings icon or settings options
    if (event.target == settingsBtn) return
    if (event.target.closest('.settings-options')) return

    settingsOptions.classList.remove('show-options')
})

// fullscreen when double click
mainVideo.addEventListener('dblclick', (event) => {
    if(event.target !== event.currentTarget) return;
    toggleFullScreen()
})

shadowControls.addEventListener("click", (event) => {
    if(event.target !== event.currentTarget) return;
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
})

shadowControls.addEventListener('dblclick', (event) => {
    if(event.target !== event.currentTarget) return;
    toggleFullScreen()
})

videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar))
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar))
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause())
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"))
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"))
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5)
skipForward.addEventListener("click", () => mainVideo.currentTime += 5)
nextEpisodeBtn.addEventListener("click", async () => {
    await video.nextEpisode()
    updated = 0
})

settingsBtn.addEventListener("click", () => {
    settingsOptions.classList.toggle("show-options")
})

/* trigger auto updating episode when the user reaches the 80% of the anime */
mainVideo.addEventListener('timeupdate', () => {
    if(mainVideo.currentTime * 100 / mainVideo.duration > 80
       && updated === 0) {
        updated = 1
        video.updateAnimeProgress()
    }
})

document.addEventListener("keydown", async (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return
    }
    
    if(videoIsDisplayed()) {
        switch(event.code) {
            case 'Space': {
                mainVideo.paused ? mainVideo.play() : mainVideo.pause()
                break
            }
            case 'ArrowLeft': {
                mainVideo.currentTime -= 5
                break
            }
            case 'ArrowUp': {
                // mainVideo.volume += 0.1
                // volumeRange.value = mainVideo.volume

                setVolume(getVolume() + 0.1)
                break
            }
            case 'ArrowRight': {
                mainVideo.currentTime += 5
                break
            }
            case 'ArrowDown': {
                // mainVideo.volume -= 0.1
                // volumeRange.value = mainVideo.volume

                setVolume(getVolume() - 0.1)
                break
            }
            case 'F11': {
                toggleFullScreen()
                break
            }
        }
        switch(event.key) {
            case 'f': {
                toggleFullScreen()
                break
            }
            case 'm': {
                toggleMute()
                break
            }
            case 'n': {
                await video.nextEpisode()
                updated = 0
                break
            }
        }
    }
})

function videoIsDisplayed() {
    if(container.style.display == 'block')
        return true

    return false
}

function toggleFullScreen() {
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")
        
        return document.exitFullscreen()
    }
    
    container.classList.toggle("fullscreen")
    fullScreenBtn.classList.replace("fa-expand", "fa-compress")
    container.requestFullscreen()
}

function toggleMute() {
    if(mainVideo.volume == 0 && videoIsDisplayed) {
        // mainVideo.volume = volumeBtn.dataset.volume;
        // volumeRange.value = volumeBtn.dataset.volume;
        setVolume(volumeBtn.dataset.volume)
        volumeBtn.setAttribute('data-volume', 0)
        return volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    } else {
        volumeBtn.setAttribute('data-volume', mainVideo.volume)
        // mainVideo.volume = 0;
        // volumeRange.value = 0;
        setVolume(0)
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    
}
