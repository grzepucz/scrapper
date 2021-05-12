const Parser = require('../Parser');
const config = require('./config.json');

/**
 *
 */
class UfcParser extends Parser {
    /**
     *
     * @param content
     * @returns {string}
     */
    prettify(content) {
        return content.trim()
            .replace(/\s+/g, ' ')
            .replace(',', '.');
    }

    /**
     *
     * @param root
     * @returns {*[]}
     */
    scrapContentType(root) {
        const result = [];
        const {
            articleSelector,
            groupSelector,
            fieldsSelector,
            articleHeaderSelector,
            articleRowSelector,
            schema,
            articleFirstRowSelector,
        } = config;
        const contentNodes = root.querySelectorAll(articleSelector);

        if (contentNodes) {
            contentNodes.forEach((article) => {
                const group = article.querySelector(groupSelector).innerText.toString().trim();
                const fields = article.querySelectorAll(fieldsSelector).map((field) => field.innerText.toLowerCase());

                article.querySelectorAll(articleRowSelector)
                    .filter((row) => !row.classNames.includes(articleHeaderSelector))
                    .forEach((row) => {
                        const content = { ...schema, group };
                        Object.entries(fields).forEach(([index, field]) => {
                            content[field] = this.prettify(row.querySelectorAll('>span')[index].innerText);
                        });
                        /*
                         * Weird magic for one case, when first rank has first total then value.
                         * Change somehow
                         */
                        if (row.classNames.includes(articleFirstRowSelector) && content.total && content.rnd) {
                            const tmp = content.total.split(' ');
                            content.total = content.rnd;
                            content.rnd = `${tmp[0].slice(0, 1)}${tmp[1]}`;
                        }

                        result.push(this.addScrappedSignature(content));
                    });
            });
        }

        return result;
    }
}

module.exports = UfcParser;
