type EventDef<D> = Event & { detail?: D }
type VideoRef = string | HTMLVideoElement | null
const eventName = 'image-updated'

export default function getVideoSnapshot(videoRef: VideoRef) {
  if (typeof videoRef === 'string') {
    videoRef = document.getElementById(videoRef) as HTMLVideoElement | null
  }
  if (!videoRef) {
    throw new Error('Video element not found')
  }
  const video = videoRef
  
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  const eventTarget = document.appendChild(
    document.createComment('imageSnapshot'),
  )

  function getImageURL() {
    let image = ''
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      image = canvas.toDataURL('image/jpeg')
    }
    return image
  }

  function eventListener() {
    eventTarget.dispatchEvent(
      new CustomEvent(eventName, { detail: getImageURL() }),
    )
  }

  video.addEventListener('seeked', eventListener)

  return {
    seekToSnap(time: number) {
      video.currentTime = time
      return getImageURL()
    },
    addSeekListener(listener: (evt: EventDef<string>) => void) {
      eventTarget.addEventListener(eventName, listener)
    },
    removeSeekListener(listener: (evt: EventDef<string>) => void) {
      eventTarget.removeEventListener(eventName, listener)
    },
    destroy() {
      eventTarget.remove()
      video.removeEventListener('seeked', getImageURL)
    },
  }
}