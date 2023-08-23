'use-strict'

const Consumet = require ('@consumet/extensions')

module.exports = class AnimeSaturn {
    constructor() {
        this.consumet = new Consumet.ANIME.AnimeSaturn
    }

    async getEpisodeUrl(animeSearch, episode) {
            const animeId = await this.getAnimeId(animeSearch)
            const animeEpisodeId = await this.getAnimeEpisodeId(animeId, episode)

            console.log(animeEpisodeId)
    
            this.consumet.fetchEpisodeSources(animeEpisodeId).then(data => {
                console.log(data)
            })
    }

    // better add more security stuff
    async getAnimeId(animeSearch) {
        const data = await this.consumet.search(animeSearch)
        return data.results[0].id
    }

    async getAnimeEpisodeId(animeId, episode) {
        const data = await this.consumet.fetchAnimeInfo(animeId)
        return data.episodes[episode-1].id
    }
}