'use-strict'

const Consumet = require('@consumet/extensions')


/**
 * Methods to fetch anime video sources and data using Consumet library 
 * 
 * @class
 */
module.exports = class Gogoanime {

    /**
     * @constructor
     */
    constructor() {
        this.consumet = new Consumet.ANIME.Gogoanime
    }

    /**
     * Gets the episode url
     * 
     * @param {*} animeSearch 
     * @param {*} episode 
     * @returns episode url
     * @returns -1 if could not get the animeId
     */
    async getEpisodeUrl(animeSearch, episode) {
        const animeId = await this.getAnimeId(animeSearch)
        if (animeId == -1) {
            return -1
        }
        const animeEpisodeId = await this.getAnimeEpisodeId(animeId, episode)
        
        const data = await this.consumet.fetchEpisodeSources(animeEpisodeId)
        return data.sources[0].url
    }

    /**
     * Gets the anime id
     * 
     * @param {*} animeSearch 
     * @returns anime id
     * @returns -1 if could not get the animeId
     */
    async getAnimeId(animeSearch) {
        const data = await this.consumet.search(animeSearch)
        
        if (data.results.length !== 0) {
            console.log('---' + animeSearch + ' ' + data.results[0].title + '---')
            return data.results[0].id
        } else {
            return -1
        }
    }

    /**
     * Gets the anime episode id
     * 
     * @param {*} animeId 
     * @param {*} episode 
     * @returns anime episode id
     */
    async getAnimeEpisodeId(animeId, episode) {
        const data = await this.consumet.fetchAnimeInfo(animeId)
        return data.episodes[episode-1].id
    }
}