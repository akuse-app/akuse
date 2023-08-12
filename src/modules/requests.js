'use strict'

const axios = require('axios')

module.exports = class Requests {
    getOptions(query, variables) {
        return JSON.stringify({
            query: query,
            variables: variables
        })
    }

    async makeRequest(method, url, headers, options) {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: options
        }).catch((error) => {
            console.log("error: " + error)
        })

        return response.data
    }
}
