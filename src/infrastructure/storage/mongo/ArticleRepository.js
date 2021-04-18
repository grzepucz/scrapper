const Article = require('@domain/Article/Article');
const MongoConnectionProvider = require('./ConnectionProvider');

class ArticleRepository {
  constructor() {
    new MongoConnectionProvider().getInstance();
  }

  saveOne(data) {
    const article = new Article(data);
    article.save().then(() => console.log('article saved'));
  }

  getAll() {
    return Article.find();
  }
}

module.exports = ArticleRepository;
