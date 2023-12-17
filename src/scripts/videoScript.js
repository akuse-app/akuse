'use-strict'

const Video = require('../modules/frontend/video')
const video = new Video()

const container = document.querySelector(".container"),
shadowControls = document.getElementsByClassName('shadow-controls')[0],
mainVideo = document.getElementById("video"),
videoTitle = document.getElementById('video-title'),
videoEpisodeTitle = document.getElementById('video-episode-title'),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".video-progress-bar"),
exitBtn = document.querySelector('.exit-video i')
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".right input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
nextEpisodeBtn = container.querySelector(".next")
speedBtn = container.querySelector(".playback-speed i"),
volumeOptions = container.querySelector(".volume-options"),
speedOptions = container.querySelector(".speed-options"),
fullScreenBtn = container.querySelector(".fullscreen i")
let timer
let updated = 0 /* for update anime progress automatically */

const hideControls = () => {
    /* if(mainVideo.paused) return */
    timer = setTimeout(() => {
        container.classList.remove("show-controls")
        shadowControls.classList.remove('show-cursor')
    }, 1500)
}

hideControls()
container.addEventListener("mousemove", () => {
    container.classList.add("show-controls")
    shadowControls.classList.add('show-cursor')
    clearTimeout(timer)
    hideControls()
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
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
})

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target
    let percent = (currentTime / duration) * 100
    progressBar.style.width = `${percent}%`
    currentVidTime.innerText = formatTime(currentTime)
})

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration)
})

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth
    progressBar.style.width = `${e.offsetX}px`
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration
    currentVidTime.innerText = formatTime(mainVideo.currentTime)
}

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
})

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed
        speedOptions.querySelector(".active").classList.remove("active")
        option.classList.add("active")
    })
})

document.addEventListener("click", e => {
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOptions.classList.remove("show")
    }
})

fullScreenBtn.addEventListener("click", () => {
    toggleFullScreen()
})

exitBtn.addEventListener("click", () => {
    updated = 0
    mainVideo.pause()
    mainVideo.currentTime = 0
    // mainVideo.removeAttribute('src')
    mainVideo.src = null
    videoTitle.innerHTML = ''
    videoEpisodeTitle.innerHTML = ''
    container.style.display = 'none'
    if(document.fullscreenEnabled) {
        document.exitFullscreen()
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")
    }
})

mainVideo.addEventListener("click", (event) => {
    if (event.target !== this)
        return
    mainVideo.paused ? mainVideo.play() : mainVideo.pause()
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
volumeBtn.addEventListener("click", () => {
    if(speedOptions.classList.contains('show-options')) 
        speedOptions.classList.toggle("show-options")
    
    volumeOptions.classList.toggle("show-options")
})
speedBtn.addEventListener("click", () => {
    if(volumeOptions.classList.contains('show-options')) 
        volumeOptions.classList.toggle("show-options")

    speedOptions.classList.toggle("show-options")
})

/* trigger auto updating episode when the user reaches the 80% of the anime */
mainVideo.addEventListener('timeupdate', () => {
    if(mainVideo.currentTime * 100 / mainVideo.duration > 80
       && updated === 0) {
        updated = 1
        video.updateAnimeProgress()
    }
})

document.addEventListener("keydown", (event) => {
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
                mainVideo.volume += 0.1
                volumeSlider.value = mainVideo.volume
                break
            }
            case 'ArrowRight': {
                mainVideo.currentTime += 5
                break
            }
            case 'ArrowDown': {
                mainVideo.volume -= 0.1
                volumeSlider.value = mainVideo.volume
                break
            }
            case 'F11': {
                toggleFullScreen()
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