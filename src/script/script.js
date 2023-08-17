'use-strict'

const { ipcRenderer } = require('electron')
const url = require('url')

const AniListAPI = require ('../modules/anilistApi')
const AnimeScrapeAPI = require ('../modules/animeScrapeApi.js')
const clientData = require ('../modules/clientData.js')

const loginButton = document.getElementById("login-button")

// press login button
loginButton.addEventListener("click", () => {
    ipcRenderer.invoke('open-login-page')
})

// OAuth is completed, so load the page with all the elements
ipcRenderer.on('load-page-elements', async (event, token) => {
    document.getElementById('login-button').style.display = 'none'
    document.getElementById('login-page').style.display = 'none'

    const anilist = new AniListAPI(clientData)
    const anime = new AnimeScrapeAPI()

    const viewerId = await anilist.getViewerId(token)
    
    // display current watching animes
    const entriesCurrent = await anilist.getViewerList(token, viewerId, 'CURRENT')
    Object.keys(entriesCurrent).forEach( key => {
        insertAnimeEntry(entriesCurrent[key], 'CURRENT', key)
    })

    // display featured
    const entryFeatured = await anilist.getAnimeInfo(1)
    insertFeaturedAnime(entryFeatured)

    // display user icon avatar
    const userInfo = await anilist.getUserInfo(token, viewerId)
    insertUserIcon(userInfo)
    
    // test
    const link = await anime.getEntryLink(entriesCurrent[1])
    console.log(link)

    // trigger anime-entry childs and retrieve id
    var list = document.getElementById('current')

    list.addEventListener('click', function(event) {
        if(!(event.target.classList.contains('anime-entry'))) {
            const entry = event.target.closest('.anime-entry')
            if(entry) {
                /* ipcRenderer.invoke('get-token') */
                createAnimePage(entry.id)
            }
        } else {
            /* ipcRenderer.invoke('get-token') */
            createAnimePage(event.target.id)
        }
    })
})

function insertAnimeEntry(animeEntry, status, key) {
    let anime_list_div = document.getElementById(status.toLowerCase())
    let anime_entry_div = createAnimeEntry(animeEntry, key)
    
    anime_list_div.appendChild(anime_entry_div, key)
}

function insertUserIcon(userInfo) {
    document.getElementById('user-icon').src = userInfo.User.avatar.large
}

function createAnimeEntry(animeEntry, key) {
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

// dynamic anime search bar
addEventListener("input", (event) => {
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
})

function insertFeaturedAnime(animeEntry) {
    const title = animeEntry.title.romaji
    const episodes = animeEntry.episodes
    const startYear = animeEntry.startDate.year
    const banner = animeEntry.bannerImage
    const genres = animeEntry.genres

    document.getElementById('featured-anime-title').innerHTML = title
    document.getElementById('featured-anime-year').innerHTML = startYear
    document.getElementById('featured-anime-episodes').innerHTML = episodes + " Episodes"
    
    var anime_genres_div = document.getElementById('featured-anime-genres')
    anime_genres_div

    Object.keys(genres).forEach( (key) => {
        anime_genres_div.innerHTML += genres[key]
        if(parseInt(key) < Object.keys(genres).length - 1) {
            anime_genres_div.innerHTML += " • "
        }
    })

    document.getElementById('featured-img').src = banner
}

// creation of the anime page
async function createAnimePage(animeEntryId) {
    const animeId = animeEntryId.slice(12) // the div id is 'anime-entry-number', so it will cut the string and keep only 'number'
    const anilist = new AniListAPI(clientData)

    const animeEntry = await anilist.getAnimeInfo(animeId)
    console.log(JSON.stringify(animeEntry))
}