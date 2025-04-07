import axios from 'axios';

var remainingRequests = 90;
var resetTime = 0;
var lockUntil = 0;

const delay = async (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const handleRateLimiting = async (current: number) => {
  if (current < lockUntil)
    await delay(lockUntil - current);

  if (current >= resetTime)
    remainingRequests = 90;

  if (remainingRequests <= 0)
    await delay(60);
};

const handleResponseHeaders = (headers: any) => {
  if (headers['x-ratelimit-remaining'])
    remainingRequests = parseInt(headers['x-ratelimit-remaining']);

  if (headers['x-ratelimit-reset'])
    resetTime = parseInt(headers['x-ratelimit-reset']);
};

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
): Promise<any> => {
  if (url === 'https://graphql.anilist.co') {
    const current = Date.now() / 1000;

    await handleRateLimiting(current);

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: headers,
        data: options,
      });

      handleResponseHeaders(response.headers);

      return response.data;
    } catch (error) {
      let response = (error as { response?: { status: number, headers: { [key: string]: any } } }).response;

      if (response && response.status === 429) {
        const retryAfter = parseInt(response.headers['retry-after'] || '60');
        lockUntil = current + retryAfter;
        await delay(retryAfter);
        return makeRequest(method, url, headers, options);
      }

      throw error;
    }
  }

  const response = await axios({
    method: method,
    url: url,
    headers: headers,
    data: options,
  });

  return response.data;
};