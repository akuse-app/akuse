'use strict'

const axios = require('axios')

/**
 * Methods to make requests
 * 
 * @class
 */
module.exports = class Requests {

    /**
     * Builds the data options for the request
     * 
     * @param {*} query
     * @param {*} variables
     * @returns object with the data options
     */
    getOptions(query = {}, variables = {}) {
        return JSON.stringify({
            query: query,
            variables: variables
        })
    }

    /**
     * Makes a Promise based HTTP request with Axios
     * 
     * @param {*} method
     * @param {*} url
     * @param {*} headers
     * @param {*} options
     * @returns object with the fetched data
     * @throws error if the request was not successful
     */
    async makeRequest(method, url, headers, options) {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: options
        })

        // console.log(response)

        return response.data
    }
}
