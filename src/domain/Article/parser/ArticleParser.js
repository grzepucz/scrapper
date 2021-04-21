const { parse, valid } = require('node-html-parser');

class ArticleParser {
  parseHTML(payload) {
    if (valid(payload)) {
      const root = parse(payload);
    }
  }
}

module.exports = ArticleParser;
