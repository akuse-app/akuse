'use-strict'

const Video = require('../modules/frontend/video')
const video = new Video()

const container = document.querySelector(".container"),
mainVideo = document.getElementById("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
exitBtn = document.querySelector('.exit-video i')
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
previousEpisodeBtn = container.querySelector(".previous i")
nextEpisodeBtn = container.querySelector(".next i")
speedBtn = container.querySelector(".playback-speed i"),
speedOptions = container.querySelector(".speed-options"),
fullScreenBtn = container.querySelector(".fullscreen i")
let timer

const hideControls = () => {
    if(mainVideo.paused) return
    timer = setTimeout(() => {
        container.classList.remove("show-controls")
    }, 1500)
}

hideControls()
container.addEventListener("mousemove", () => {
    container.classList.add("show-controls")
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

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    } else {
        mainVideo.volume = 0.0
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    volumeSlider.value = mainVideo.volume
})

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
    container.classList.toggle("fullscreen")
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand")

        return document.exitFullscreen()
    }
    
    fullScreenBtn.classList.replace("fa-expand", "fa-compress")
    container.requestFullscreen()
})

exitBtn.addEventListener("click", () => {
    mainVideo.pause()
    container.style.display = 'none'
    document.exitFullscreen()
})

playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause())
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"))
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"))
mainVideo.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause())
skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5)
skipForward.addEventListener("click", () => mainVideo.currentTime += 5)
nextEpisodeBtn.addEventListener("click", async () => await video.nextEpisode())
previousEpisodeBtn.addEventListener("click", async () => await video.previousEpisode())
speedBtn.addEventListener("click", () => speedOptions.classList.toggle("show-section"))
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar))
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar))


document.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return
    }
    
    if(container.style.display == 'block') {
        if(event.keyCode === 32) {
            mainVideo.paused ? mainVideo.play() : mainVideo.pause()
        } else if(event.keyCode === 37) {
            mainVideo.currentTime -= 5
        } else if(event.keyCode === 38) {
            mainVideo.volume += 0.1
            volumeSlider.value = mainVideo.volume
        } else if(event.keyCode === 39) {
            mainVideo.currentTime += 5
        } else if(event.keyCode === 40) {
            mainVideo.volume -= 0.1
            volumeSlider.value = mainVideo.volume
        }
    }
})