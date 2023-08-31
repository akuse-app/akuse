'use strict'

const Requests = require ('../requests.js')

module.exports = class AniListAPI extends Requests {
    constructor(clientData) {
        super()
        this.clientData = clientData
        this.method = 'POST'
        this.graphQLUrl = 'https://graphql.anilist.co'
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        this.mediaData =
        `
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
                extraLarge
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
            siteUrl
        `
    }

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
    
    async getViewerId(token) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        var query = `
            query {
                Viewer {
                    id
                }
            }
        `

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.Viewer.id
    }

    async getViewerList(token, viewerId, status) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

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
                                ${this.mediaData}
                            }
                        }
                    }
                }
            }
        `

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.MediaListCollection.lists[0].entries
    }

    // NOT WORKING
    async getFollowingUsers(token, viewerId) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

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

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        console.log(typeof respData.data)
        console.log(" -> " + JSON.stringify(respData))
    }

    async getAnimeInfo(animeId) {
        var query = `
            query ($id: Int) {
                Media (id: $id, type: ANIME) {
                    ${this.mediaData}
                }
            }
        `

        var variables = {
            id: animeId
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Media
    }

    async getTrendingAnimes() {
        var query = `
        {
            Page(page: 1, perPage: 30) {
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

    async getMostPopularAnimes() {
        var query = `
        {
            Page(page: 1, perPage: 30) {
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

    async getAnimesByGenre(genre) {
        var query = `
        {
            Page(page: 1, perPage: 30) {
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

        const options = this.getOptions(query)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, this.headers, options)

        return respData.data.Page
    }

    async getUserInfo(token, viewerId) {
        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

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

        var variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data
    }
}
