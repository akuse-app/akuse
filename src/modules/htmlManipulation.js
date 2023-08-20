'use-strict'

module.exports = class htmlManipulation {
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
}