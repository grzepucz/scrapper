const { parse, valid } = require('node-html-parser');
const Raven = require('raven');
const { env } = require('process');
const config = require('./config/config.json');

const DEFAULT = 'default';

const getConfig = () => {
    try {
        return config[env.PAGE_PARSER || DEFAULT];
    } catch (error) {
        Raven.captureException(error);
        return error;
    }
};

class ArticleParser {
    addScrappedSignature(element) {
        return {
            ...element,
            scrappedAt: new Date(),
        };
    }

    /**
     *
     * @param root HTMLElement
     */
    scrapContentType(root) {
        const result = [];
        const { content: { selector: articleSelector, fields } } = getConfig();
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

    /**
     *
     * @param payload string
     */
    parseHTML(payload) {
        return new Promise((resolve) => {
            if (valid(payload)) {
                const root = parse(payload);
                const data = this.scrapContentType(root);

                resolve(data);
            } else {
                resolve(null);
            }
        }).then((data) => data);
    }
}

module.exports = ArticleParser;
