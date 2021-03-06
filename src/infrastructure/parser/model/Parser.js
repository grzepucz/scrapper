const { parse, valid } = require('node-html-parser');
const NotImplementedError = require('../error/NotImplementedError');

/**
 *
 * @param data
 * @returns {boolean|any}
 */
const isJSON = (data) => {
    try {
        return JSON.parse(data);
    } catch (error) {
        return false;
    }
};

/**
 *
 */
class Parser {
    /**
     *
     * @param element
     * @returns {{scrappedAt: string}}
     */
    addScrappedSignature(element) {
        return {
            ...element,
            scrappedAt: new Date().toJSON(),
        };
    }

    /**
     * Needs to be overwritten
     */
    scrapContentType() {
        throw new NotImplementedError();
    }

    /**
     *
     * @param payload string
     */
    parseHTML(payload) {
        return new Promise((resolve) => {
            const root = parse(payload);
            const data = this.scrapContentType(root);

            resolve(data);
        }).then((data) => data);
    }

    /**
     *
     * @param payload
     * @returns {Promise<*>}
     */
    parseJSON(payload) {
        return new Promise((resolve) => {
            const data = this.scrapContentType(JSON.parse(payload));

            resolve(data);
        }).then((data) => data);
    }

    /**
     *
     * @param payload
     * @returns {Promise<*>}
     */
    parse(payload) {
        return new Promise((resolve, reject) => {
            if (isJSON(payload)) {
                resolve(this.parseJSON(payload));
            } else if (valid(payload)) {
                resolve(this.parseHTML(payload));
            } else {
                reject(new Error('No valid data.'));
            }
        }).then((data) => data);
    }
}

module.exports = Parser;
