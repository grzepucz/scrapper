const { News } = require('@domain');
const Raven = require('raven');
const Connector = require('../Connector');

const handleError = (error) => {
    console.error(error);
    Raven.captureException(error);

    throw error;
};

class NewsRepository {
    static saveOne(data) {
        return Connector.getConnection()
            .then(() => News.findOneAndUpdate({ id: data.id }, data, {
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
                    data.forEach((element) => News.findOneAndUpdate({ id: element.id }, element, {
                        upsert: true,
                        useFindAndModify: false,
                    }));
                }
            })
            .then(() => data)
            .catch((error) => handleError(error));
    }

    static getAll() {
        return Connector.getConnection()
            .then(() => News.find())
            .then((data) => data)
            .catch((error) => handleError(error));
    }
}

module.exports = NewsRepository;
