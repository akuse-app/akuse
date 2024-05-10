import AnimeSaturn from "@consumet/extensions/dist/providers/anime/animesaturn"

const consumet = new AnimeSaturn()

    /**
     * Gets the episode url and isM3U8 flag
     * 
     * @param {*} animeSearch 
     * @param {*} episode 
     * @returns episode object (url + isM3U8 flag) in streamtape quality
     * @returns -1 if could not get the animeId or the animeEpisodeId
     */
    export const getEpisodeUrl = async (animeSearch: string, episode: number, dubbed: boolean) => {
        const animeId = await getAnimeId(dubbed ? `${animeSearch} (ITA)` : animeSearch)
        if (animeId == -1) return -1

        const animeEpisodeId = await getAnimeEpisodeId(animeId, episode)
        if(animeEpisodeId === undefined) return -1

        const data = await consumet.fetchEpisodeSources(animeEpisodeId)

        return data.sources[1] // [1] is streamtape
    }

    /**
     * Gets the anime id
     * 
     * @param {*} animeSearch 
     * @returns anime id
     * @returns -1 if could not get the animeId
     */
    export const getAnimeId = async (animeSearch: string) => {
        const data = await consumet.search(animeSearch)
        
        if (data.results.length !== 0) {
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
    export const getAnimeEpisodeId = async (animeId: string, episode: number) => {
        const data = await consumet.fetchAnimeInfo(animeId)
        return data.episodes[episode-1]?.id
    }
}