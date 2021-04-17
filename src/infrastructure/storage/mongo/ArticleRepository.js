require('./Connector');
const Article = require('@domain/Article/Article');

class ArticleRepository {
  saveOne(data) {
    const article = new Article(data);
    article.save().then(() => console.log('article saved'));
  }
}

module.exports = ArticleRepository;
