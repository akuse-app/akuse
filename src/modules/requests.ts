import axios from 'axios';

/**
 * Builds the data options for the request
 *
 * @param {*} query
 * @param {*} variables
 * @returns object with the data options
 */
export const getOptions = (query: any = {}, variables: any = {}) => {
  return JSON.stringify({
    query: query,
    variables: variables,
  });
};

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
export const makeRequest = async (
  method: 'GET' | 'POST' | string,
  url: string,
  headers: any = {},
  options: any = {},
) => {
  const response = await axios({
    method: method,
    url: url,
    headers: headers,
    data: options,
  });

  return response.data;
};
