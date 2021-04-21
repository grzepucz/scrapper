const Article = require('@domain/Article/Article');
const Raven = require('raven');
const Connector = require('../Connector');

class ArticleRepository {
  saveOne(data) {
    return Connector.getConnection()
      .then(() => {
        const article = new Article(data);
        return article.save().then(() => console.log('Data saved'));
      })
      .catch((error) => Raven.captureException(error));
  }

  saveAll(data) {
    return Connector.getConnection()
      .then(() => {
        if (Array.isArray(data) && data.length) {
          data.forEach((element) => {
            const article = new Article(element);
            article.save().then(() => console.log('Data saved'));
          });
        }
      })
      .catch((error) => Raven.captureException(error));
  }

  getAll() {
    return Connector.getConnection()
      .then(() => Article.find())
      .catch((error) => Raven.captureException(error));
  }
}

module.exports = ArticleRepository;
