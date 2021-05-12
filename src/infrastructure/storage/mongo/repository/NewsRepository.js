const { News } = require('@domain');
const Raven = require('raven');
const Connector = require('../Connector');

/**
 *
 * @param error
 */
const handleError = (error) => {
    console.error(error);
    Raven.captureException(error);

    throw error;
};

/**
 *
 */
class NewsRepository {
    /**
     *
     * @param data
     * @returns {Promise<* | void>}
     */
    static saveOne(data) {
        return Connector.getConnection()
            .then(() => News.findOneAndUpdate({ id: data.id }, data, {
                upsert: true,
                useFindAndModify: false,
            }))
            .then(() => data)
            .catch((error) => handleError(error));
    }

    /**
     *
     * @param data
     * @returns {Promise<* | void>}
     */
    static saveAll(data) {
        return Connector.getConnection()
            .then(() => {
                if (Array.isArray(data) && data.length) {
                    data.forEach((element) => News.findOneAndUpdate({ id: element.id }, element, {
                        upsert: true,
                        useFindAndModify: false,
                    }));
                }
            })
            .then(() => data)
            .catch((error) => handleError(error));
    }

    /**
     *
     * @returns {Promise<* | void>}
     */
    static getAll() {
        return Connector.getConnection()
            .then(() => News.find())
            .then((data) => data)
            .catch((error) => handleError(error));
    }
}

module.exports = NewsRepository;
