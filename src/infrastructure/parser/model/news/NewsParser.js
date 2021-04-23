const Parser = require('../Parser');
const config = require('./config.json');

class NewsParser extends Parser {
    constructor() {
        super();
        const { content: { domain } } = config;
        this.domain = domain;
    }

    addDomainToUrl(url) {
        return `${this.domain}${url}`;
    }

    overwriteDate(date) {
        const dateLabelDelimiter = ' | ';
        const [prefix, time] = date.split(dateLabelDelimiter);

        // Ugly as fuck... Change @TODO
        const replaced = prefix.replace(/^Dzisiaj$/g, new Date(Date.now()).toJSON().split('T')[0])
            .replace(/^Wczoraj$/g, new Date(Date.now() - 24 * 3600 * 1000).toJSON().split('T')[0])
            .replace(/^Przedwczoraj$/g, new Date(Date.now() - 48 * 3600 * 1000).toJSON().split('T')[0]);

        return `${replaced}T${time}`;
    }

    scrapSubfields({ subfields, record }) {
        const result = [];

        if (Array.isArray(record)) {
            record.forEach((element) => {
                const parsed = {};

                subfields.forEach((subfield) => {
                    const {
                        field, selector, parse, subfields: nestedFields,
                    } = subfield;

                    parsed[field] = parse ? this[parse](element[selector]) : element[selector];

                    if (nestedFields) {
                        parsed[field] = this.scrapSubfields({ subfields: nestedFields, record: element[selector] });
                    }
                });

                result.push(parsed);
            });
        }

        return result;
    }

    /**
     *
     * @param json
     * @returns {*[]}
     */
    scrapContentType(json) {
        const result = [];
        const { news } = json;
        const { content: { fields } } = config;

        if (news) {
            news.forEach((record) => {
                const parsed = {};

                fields.forEach((configField) => {
                    const {
                        field, selector, parse, subfields,
                    } = configField;

                    parsed[field] = parse ? this[parse](record[selector]) : record[selector];

                    if (subfields) {
                        parsed[field] = this.scrapSubfields({ subfields, record: record[selector] });
                    }
                });

                result.push(this.addScrappedSignature(parsed));
            });
        }

        return result;
    }

    parseJSON(payload) {
        return new Promise((resolve) => {
            const data = this.scrapContentType(JSON.parse(payload));

            resolve(data);
        });
    }
}

module.exports = NewsParser;
