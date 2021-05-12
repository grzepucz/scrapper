const { Ufc } = require('@domain');
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
class UfcRepository {
    /**
     *
     * @param data
     * @returns {Promise<* | void>}
     */
    static saveOne(data) {
        return Connector.getConnection()
            .then(() => Ufc.findOneAndUpdate({ group: data.group, rnk: data.rnk }, data, {
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
                    data.forEach((element) => new Ufc(element).save());
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
            .then(() => Ufc.find())
            .then((data) => data)
            .catch((error) => handleError(error));
    }
}

module.exports = UfcRepository;
