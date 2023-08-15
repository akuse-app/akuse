const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openLoginPage: () => ipcRenderer.send('open-login-page')  
})

ipcRenderer.on('giveEntries', (event, entries, status) => {
    Object.keys(entries).forEach( key => {
        insertAnimeEntry(entries[key], status, key)
    })
})

ipcRenderer.on('giveUserInfo', (event, userInfo) => {
    insertUserIcon(userInfo)
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
    const animeName = animeEntry.media.title.romaji
    const progress = animeEntry.progress
    const cover = animeEntry.media.coverImage.extraLarge
    
    var episodes
    animeEntry.media.episodes == null ? episodes = '?' : episodes = animeEntry.media.episodes

    let anime_entry_div = document.createElement('div')
    anime_entry_div.classList.add('anime-entry')
    
    /* let index = parseInt(key) + 1 */
    anime_entry_div.id = ('anime-entry-' + key)

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
    });
});