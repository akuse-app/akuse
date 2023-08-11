'use strict';

const axios = require('axios')

module.exports = class Requests {
    getOptions(query, variables) {
        return JSON.stringify({
            query: query,
            variables: variables
        })
    }

    async axiosRequest(method, url, headers, options) {
        try{
            const response = await axios({
                method: method,
                url: url,
                headers: headers,
                data: options
            })

            return response.data

        } catch(error) {
            console.log(Object.keys(error), error.message);
        }
    }
}
