'use-strict'

const { ipcRenderer } = require('electron')
const url = require('url')

const AniListAPI = require ('../modules/anilistApi')
const AnimeScrapeAPI = require ('../modules/animeScrapeApi.js')
const HTMLManipulation = require ('../modules/htmlManipulation')
const clientData = require ('../modules/clientData.js')

const months = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '1': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

// press login button
const loginButton = document.getElementById("login-button")
loginButton.addEventListener("click", () => {
    ipcRenderer.invoke('open-login-page')
})

// OAuth is completed, so load the page with all the elements
ipcRenderer.on('load-page-elements', async (event, token) => {
    document.getElementById('login-button').style.display = 'none'
    document.getElementById('login-page').style.display = 'none'

    const anilist = new AniListAPI(clientData)
    const anime = new AnimeScrapeAPI()
    const htmlMan = new HTMLManipulation()

    const viewerId = await anilist.getViewerId(token)
    
    // display current
    const entriesCurrent = await anilist.getViewerList(token, viewerId, 'CURRENT')
    htmlMan.displayAnimeSection(entriesCurrent)

    const entryFeatured = await anilist.getAnimeInfo(1)
    htmlMan.displayFeaturedAnime(entryFeatured)

    const userInfo = await anilist.getUserInfo(token, viewerId)
    htmlMan.displayUserAvatar(userInfo)
    
    // test
    const link = await anime.getEntryLink(entriesCurrent[1])
    console.log(link)
})

// dynamic anime search bar (NOT WORKING)
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

// trigger anime-entry childs and retrieve id (MUST WORK FOR ALL SECTIONS)
var list = document.getElementById('current')
list.addEventListener('click', function(event) {
    if(!(event.target.classList.contains('anime-entry'))) {
        const entry = event.target.closest('.anime-entry')
        if(entry) {
            createAnimePage(entry.id)
        }
    } else {
        createAnimePage(event.target.id)
    }
})

// creation of the anime page
async function createAnimePage(animeEntryId) {
    const animeId = animeEntryId.slice(12) // the div id is 'anime-entry-number', so it will cut the string and keep only 'number'
    const anilist = new AniListAPI(clientData)

    document.getElementById('anime-page').style.display = 'flex'

    const animeEntry = await anilist.getAnimeInfo(animeId)
    console.log(JSON.stringify(animeEntry))

    displayAnimePage(animeEntry)
}

function displayAnimePage(animeEntry) {
    // retrieve infos
    const title = animeEntry.title.romaji
    const id = animeEntry.id
    const description = animeEntry.description
    const status = animeEntry.status
    const startDate = months[animeEntry.startDate.month] + " " + animeEntry.startDate.day + ", "  + animeEntry.startDate.year

    var endDate
    animeEntry.endDate.year == null ? endDate = '?' : endDate = months[animeEntry.endDate.month] + " " + animeEntry.endDate.day + ", "  + animeEntry.endDate.year

    const cover = animeEntry.coverImage.extraLarge
    const genres = animeEntry.genres
    
    // put infos in page
    let page_anime_title_div = document.getElementById('page-anime-title')
    page_anime_title_div.innerHTML = title
    
    let span_id = document.createElement('span')
    span_id.innerHTML = " #" + id
    
    page_anime_title_div.appendChild(span_id)
    
    document.getElementById('page-anime-description').innerHTML = description
    document.getElementById('page-anime-status').innerHTML = status
    document.getElementById('page-anime-startDate').innerHTML = startDate
    document.getElementById('page-anime-endDate').innerHTML = endDate
    document.getElementById('page-anime-cover').src = cover
    
    var anime_genres_div = document.getElementById('page-anime-genres')
    Object.keys(genres).forEach( (key) => {
        anime_genres_div.innerHTML += genres[key]
        if(parseInt(key) < Object.keys(genres).length - 1) {
            anime_genres_div.innerHTML += " • "
        }
    })
}

// anime page closer
const exit_button = document.getElementById('exit')
exit_button.addEventListener('click', (event) => {
    document.getElementById('page-anime-title').innerHTML = ""
    /* document.getElementById('page-anime-id').innerHTML = "" */
    document.getElementById('page-anime-description').innerHTML = ""
    document.getElementById('page-anime-status').innerHTML = ""
    document.getElementById('page-anime-startDate').innerHTML = ""
    document.getElementById('page-anime-endDate').innerHTML = ""
    document.getElementById('page-anime-cover').src = ""
    document.getElementById('page-anime-genres').innerHTML = ""

    document.getElementById('anime-page').style.display = 'none'
})

// drag n scroll
const slider = document.getElementsByClassName('anime-list-wrapper')[0];
let mouseDown = false;
let startX, scrollLeft;

let startDragging = function (event) {
  mouseDown = true;
  startX = event.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
};
let stopDragging = function (event) {
  mouseDown = false;
};

slider.addEventListener('mousemove', (event) => {
    event.preventDefault();
  if(!mouseDown) { return; }
  const x = event.pageX - slider.offsetLeft;
  const scroll = x - startX;
  slider.scrollLeft = scrollLeft - scroll;
});

slider.addEventListener('mousedown', startDragging, false);
slider.addEventListener('mouseup', stopDragging, false);
slider.addEventListener('mouseleave', stopDragging, false);

// fade-in animation when some items are in the document viewport
const element = document.getElementsByClassName("fade-in")
Object.keys(element).forEach( (key) => {
    if (isInViewport(element[key])) {
        element[key].classList.add('show');
    }
})

document.addEventListener("scroll", () => {
    Object.keys(element).forEach( (key) => {
        if (isInViewport(element[key])) {
            element[key].classList.add('show');
        }
    })
})

function isInViewport(element) {
    var bounding = element.getBoundingClientRect()

    if (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)   
    ) return true
    
    return false
}