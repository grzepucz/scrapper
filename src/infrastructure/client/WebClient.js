const fetch = require('node-fetch');
const Raven = require('raven');

/**
 *
 */
class WebClient {
    /**
     *
     * @param url
     * @returns {Promise<T>}
     */
    getPage(url) {
        return fetch(url)
            .then((response) => response.text())
            .then((response) => response)
            .catch((error) => Raven.captureException(error));
    }
}

module.exports = WebClient;
