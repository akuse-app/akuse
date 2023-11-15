'use strict'

const Store = require('electron-store')
const Requests = require ('../requests.js')

const store = new Store()

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
        `
    }

    /**
     * Retrieves the access token for the api
     * 
     * @param {*} currentUrl 
     * @returns access token
     */
    async getAccessToken(currentUrl) {
        const code = currentUrl.searchParams.get("code")
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
     * @param {*} token 
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
            'Authorization': 'Bearer ' + store.get('access_token'),
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
     * @param {*} token 
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
            'Authorization': 'Bearer ' + store.get('access_token'),
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
     * @param {*} token 
     * @param {*} viewerId 
     * @param {*} status 
     * @returns object with anime entries
     */
    async getViewerList(viewerId, status) {
        var query = `
            query($userId : Int) {
                MediaListCollection(userId : $userId, type: ANIME, status : ${status}, sort: UPDATED_TIME) {
                    lists {
                        isCustomList
                        name
                        entries {
                            id
                            mediaId
                            progress
                            media {
                                id
                                title {
                                    romaji
                                    english
                                }
                                coverImage {
                                    large
                                    color
                                }
                                episodes
                                nextAiringEpisode {
                                    id
                                    airingAt
                                    episode
                                }
                                startDate {
                                    year
                                    month
                                    day
                                }
                            }
                        }
                    }
                }
            }
        `

        var headers = {
            'Authorization': 'Bearer ' + store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        if(Object.keys(respData.data.MediaListCollection.lists).length !== 0) {
            return respData.data.MediaListCollection.lists[0].entries
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
            'Authorization': 'Bearer ' + store.get('access_token'),
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
            'Authorization': 'Bearer ' + store.get('access_token'),
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
     * 
     * @returns object with trending animes
     */
    async getTrendingAnimes() {
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

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Page
    }

    /**
     * Gets the current most popular animes on anilist
     * 
     * @returns object with most popular animes
     */
    async getMostPopularAnimes() {
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

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

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
     * 
     * @param {*} genre 
     * @returns object with animes entries filtered by genre
     */
    async getAnimesByGenre(genre) {
        var query = `
        {
            Page(page: 1, perPage: ${this.pages}) {
                pageInfo {
                    total
                    currentPage
                    hasNextPage
                }
                media(genre: "${genre}", sort: TRENDING_DESC, type: ANIME) {
                    id
                    title {
                        romaji
                        english
                    }
                    coverImage {
                        large
                        color
                    }
                    startDate {
                        year
                        month
                        day
                    }
                }
            } 
        }
        `

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

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
            'Authorization': 'Bearer ' + store.get('access_token'),
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
    
    async deleteAnimeFromList(id) {
        var query = "mutation($id:Int){DeleteMediaListEntry(id:$id){deleted}}"

        var headers = {
            'Authorization': 'Bearer ' + store.get('access_token'),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        
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
            'Authorization': 'Bearer ' + store.get('access_token'),
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
