'use strict'

const Requests = require ('./requests.js')

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

        const query = `
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

        const query = `
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
                                status
                                episodes
                                title {
                                    romaji
                                    english
                                    native
                                    userPreferred
                                }
                                coverImage {
                                    extraLarge
                                }
                            }
                        }
                    }
                }
            }
        `

        const variables = {
            userId: viewerId,
        }

        const options = this.getOptions(query, variables)
        const respData = await this.makeRequest(this.method, this.graphQLUrl, headers, options)

        return respData.data.MediaListCollection.lists[0].entries

        console.log("resp: " + JSON.stringify(respData.data.MediaListCollection.lists[0].entries))
    }
}
