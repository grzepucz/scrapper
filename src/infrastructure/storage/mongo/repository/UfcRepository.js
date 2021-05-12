const { Ufc } = require('@domain');
const Raven = require('raven');
const Connector = require('../Connector');

const handleError = (error) => {
    console.error(error);
    Raven.captureException(error);

    throw error;
};

class UfcRepository {
    static saveOne(data) {
        return Connector.getConnection()
            .then(() => Ufc.findOneAndUpdate({ group: data.group, rnk: data.rnk }, data, {
                upsert: true,
                useFindAndModify: false,
            }))
            .then(() => data)
            .catch((error) => handleError(error));
    }

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

    static getAll() {
        return Connector.getConnection()
            .then(() => Ufc.find())
            .then((data) => data)
            .catch((error) => handleError(error));
    }
}

module.exports = UfcRepository;
