const { Article } = require('@domain');
const Raven = require('raven');
const Connector = require('../Connector');

const handleError = (error) => {
    console.error(error);
    Raven.captureException(error);

    throw error;
};

class ArticleRepository {
    static saveOne(data) {
        return Connector.getConnection()
            .then(() => Article.findOneAndUpdate({ id: data.id }, data, { upsert: true, useFindAndModify: false }))
            .then(() => data)
            .catch((error) => handleError(error));
    }

    static saveAll(data) {
        return Connector.getConnection()
            .then(() => {
                if (Array.isArray(data) && data.length) {
                    data.forEach((element) => {
                        Article.findOneAndUpdate({ id: element.id }, element, { upsert: true, useFindAndModify: false })
                            .then(() => console.log('Article appended.'));
                    });
                }
            })
            .then(() => data)
            .catch((error) => handleError(error));
    }

    static getAll() {
        return Connector.getConnection()
            .then(() => Article.find())
            .then((data) => data)
            .catch((error) => handleError(error));
    }
}

module.exports = ArticleRepository;
