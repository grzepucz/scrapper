const Article = require('@domain/Article/Article');
const Raven = require('raven');
const Connector = require('../Connector');

class ArticleRepository {
    static saveOne(data) {
        return Connector.getConnection()
            .then(() => Article.findOneAndUpdate({ id: data.id }, data, { upsert: true, useFindAndModify: false }))
            .catch((error) => Raven.captureException(error));
    }

    static saveAll(data) {
        return Connector.getConnection()
            .then(() => {
                if (Array.isArray(data) && data.length) {
                    data.forEach((element) => {
                        Article.findOneAndUpdate({ id: element.id }, element, { upsert: true, useFindAndModify: false })
                            .then(() => console.log('Data appended.'));
                    });
                }
            })
            .catch((error) => Raven.captureException(error));
    }

    static getAll() {
        return Connector.getConnection()
            .then(() => Article.find())
            .catch((error) => Raven.captureException(error));
    }
}

module.exports = ArticleRepository;
