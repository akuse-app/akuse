'use strict'

const Store = require('electron-store')
const Requests = require('../requests.js')

/**
 * Authentication and queries with AniList API
 * 
 * @class
 */
module.exports = class AniListAPI extends Requests {

    /**
     * @constructor
     * @param {*} clientData
     */
    constructor(clientData) {
        super()
        this.store = new Store()
        this.clientData = clientData
        this.pages = 15
        this.method = 'POST'
        this.graphQLUrl = 'https://graphql.anilist.co'
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        this.mediaData = `
            id
            title {
                romaji
                english
                native
                userPreferred
            }
            format
            status
            description
            startDate {
                year
                month
                day
            }
            endDate {
                year
                month
                day
            }
            season
            seasonYear
            episodes
            duration
            coverImage {
                large
                extraLarge
                color
            }
            bannerImage
            genres
            synonyms
            averageScore
            meanScore
            popularity
            favourites
            isAdult
            nextAiringEpisode {
                id
                airingAt
                episode
            }
            mediaListEntry {
                status
                score(format:POINT_10)
                progress
            }
            siteUrl
            trailer {
                id
                site
                thumbnail
            }
            streamingEpisodes {
                title
                thumbnail
            }
        `
    }

    /**
     * Retrieves the access token for the api
     * 
     * @param {*} code 
     * @returns access token
     */
    async getAccessToken(code) {
        const url = "https://anilist.co/api/v2/oauth/token"
        const data = {
            'grant_type': 'authorization_code',
            'client_id': this.clientData.clientId,
            'client_secret': this.clientData.clientSecret,
            'redirect_uri': this.clientData.redirectUri,
            'code': code
        }

        const respData = await this.makeRequest(this.method, url, this.headers, data)

        return respData.access_token
    }

    /**
     * Gets the anilist viewer (user) id
     * 
     * @returns viewer id
     */
    async getViewerId() {
        var query = `
            query {
                Viewer {
                    id
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.Viewer.id
    }

    /**
     * Gets the viewer (user) info
     * 
     * @param {*} viewerId 
     * @returns object with viewer info
     */
    async getViewerInfo(viewerId) {
        var query = `
            query($userId : Int) {
                User(id: $userId, sort: ID) {
                    id
                    name
                    avatar {
                        large
                    }
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data
    }

    /**
     * Gets a viewer list (current, completed...)
     * 
     * @param {*} viewerId 
     * @param {*} status 
     * @returns object with anime entries
     */
    async getViewerList(viewerId, status) {
        var query = `
            query($userId : Int) {
                MediaListCollection(userId : $userId, type: ANIME, status : ${status}, sort: UPDATED_TIME_DESC) {
                    lists {
                        isCustomList
                        name
                        entries {
                            id
                            mediaId
                            progress
                            media {
                                ${this.mediaData}
                            }
                        }
                    }
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)

        try {
            const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)
            return respData.data.MediaListCollection.lists[0].entries
        } catch (error) {
            console.log(`${status} not fetched`)
            console.log(error)
        }
    }

    // NOT WORKING
    async getFollowingUsers(viewerId) {
        var query = `
            query($userId : Int) {
                User(id: $userId, sort: ID) {
                    id
                    name
                    avatar {
                        large
                    }
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)
    }

    /**
     * Gets the info from an anime
     * 
     * @param {*} animeId 
     * @returns object with anime info
     */
    async getAnimeInfo(animeId) {
        var query = `
            query($id: Int) {
                Media(id: $id, type: ANIME) {
                    ${this.mediaData}
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            id: animeId
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.Media
    }

    /**
     * Gets the current trending animes on anilist
     * pass viewerId to make an authenticated request
     * 
     * @param {*} viewerId
     * @returns object with trending animes
     */
    async getTrendingAnimes(viewerId) {
        // not logged query
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(sort: TRENDING_DESC, type: ANIME) {
                    ${this.mediaData}
                }
            } 
        }
        `

        if (viewerId) {
            var headers = {
                'Authorization': 'Bearer ' + this.store.get('access_token'),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        } else {
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)
        return respData.data.Page
    }

    /**
     * Gets the current most popular animes on anilist
     * pass viewerId to make an authenticated request
     * 
     * @param {*} viewerId
     * @returns object with most popular animes
     */
    async getMostPopularAnimes(viewerId) {
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(sort: POPULARITY_DESC, type: ANIME) {
                    ${this.mediaData}
                }
            } 
        }
        `

        if (viewerId) {
            var headers = {
                'Authorization': 'Bearer ' + this.store.get('access_token'),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        } else {
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.Page
    }

    /**
     * Gets the next anime releases
     * 
     * @returns object with next anime releases
     */
    async nextAnimeReleases() {
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(status: NOT_YET_RELEASED, sort: POPULARITY_DESC, type: ANIME) {
                    ${this.mediaData}
                }
            } 
        }
        `

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Page
    }

    /**
     * Gets searched anime with filters
     * 
     * @param {*} args 
     * @returns object with the searched filtered anime
     */
    async searchFilteredAnime(args) {
        var query = `
        {
            Page(page: 1, perPage: 50) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(${args}) {
                    ${this.mediaData}
                }
            } 
        }
        `

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Page
    }

    /**
     * Gets the next anime releases
     * 
     * @returns object with next anime releases
     */
    async releasingAnimes() {
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(status: RELEASING, sort: POPULARITY_DESC, type: ANIME) {
                    ${this.mediaData}
                }
            } 
        }
        `

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Page
    }

    /**
     * Gets the current trending animes filtered by a genre
     * pass viewerId to make an authenticated request
     * 
     * @param {*} genre 
     * @param {*} viewerId 
     * @returns object with animes entries filtered by genre
     */
    async getAnimesByGenre(genre, viewerId) {
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(genre: "${genre}", sort: TRENDING_DESC, type: ANIME) {
                    ${this.mediaData}
                }
            } 
        }
        `

        if (viewerId) {
            var headers = {
                'Authorization': 'Bearer ' + this.store.get('access_token'),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        } else {
            var headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.Page
    }

    /**
     * Gets anime entries from a search query
     * 
     * @param {*} input 
     * @returns object with searched animes
     */
    async getSearchedAnimes(input) {
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                media(search: "${input}", type: ANIME, sort: SEARCH_MATCH) {
                    ${this.mediaData}
                }
            }
        }
        `

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Page.media
    }

    /* MUTATIONS */

    async updateAnimeFromList(mediaId, status, scoreRaw, progress) {
        var query = `
            mutation($mediaId: Int, $progress: Int, $scoreRaw: Int, $status: MediaListStatus) {
                SaveMediaListEntry(mediaId: $mediaId, progress: $progress, scoreRaw: $scoreRaw, status: $status) {
                    score(format:POINT_10_DECIMAL)
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            "mediaId": mediaId,
            "status": status,
            "scoreRaw": scoreRaw,
            "progress": progress
        }

        const options = this.getOptions(query, variables)
        await this.makeRequest(this.method, this.graphQLUrl, headers, options)
    }

    // NOT WORKING
    async deleteAnimeFromList(id) {
        var query = `
            mutation($id: Int){
                DeleteMediaListEntry(id: $id){
                    deleted
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        console.log(id)
        console.log(typeof id)
        var variables = {
            "id": id
        }

        const options = this.getOptions(query, variables)
        await this.makeRequest(this.method, this.graphQLUrl, headers, options)
    }

    /**
     * Updates the progress of an anime on list
     * 
     * @param {*} mediaId 
     * @param {*} progress 
     */
    async updateAnimeProgress(mediaId, progress) {
        var query = `
            mutation($mediaId: Int, $progress: Int) {
                SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
                    id
                    progress
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + this.store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            "mediaId": mediaId,
            "progress": progress
        }

        const options = this.getOptions(query, variables)
        await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        console.log(`Progress updated (${progress})`)
    }
}
