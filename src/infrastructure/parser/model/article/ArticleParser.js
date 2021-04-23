const Parser = require('../Parser');
const config = require('./config.json');

class ArticleParser extends Parser {
    /**
     *
     * @param root
     * @returns {*[]}
     */
    scrapContentType(root) {
        const result = [];
        const { content: { selector: articleSelector, fields } } = config;
        const contentNodes = root.querySelectorAll(articleSelector);

        if (contentNodes && fields) {
            const extractValue = ({ attribute, selector, article }) => {
                const node = selector && article.querySelector(selector);
                let value = null;

                if (attribute && selector) {
                    value = node && node.getAttribute(attribute);
                } else if (selector) {
                    value = node && node.innerText;
                } else if (attribute) {
                    value = article.getAttribute(attribute);
                }

                return value && value.toString().trim();
            };

            contentNodes.forEach((article) => {
                const content = {};

                fields.forEach(({ field, selector, attribute }) => {
                    content[field] = extractValue({ attribute, selector, article });
                });

                result.push(this.addScrappedSignature(content));
            });
        }

        return result;
    }
}

module.exports = ArticleParser;
