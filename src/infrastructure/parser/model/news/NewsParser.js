const Parser = require('../Parser');
const config = require('./config.json');

const yesterday = 24 * 3600 * 1000;
const theDayBefore = 48 * 3600 * 1000;

const rearrangeDate = (date) => {
    const [dd, mm, yyyy] = date.split('-');
    return `${yyyy}-${mm}-${dd}`;
};

const formatDate = (date) => rearrangeDate(
    date.replace(/^Dzisiaj$/g, new Date(Date.now()).toJSON().split('T')[0])
        .replace(/^Wczoraj$/g, new Date(Date.now() - yesterday).toJSON().split('T')[0])
        .replace(/^Przedwczoraj$/g, new Date(Date.now() - theDayBefore).toJSON().split('T')[0])
        .replace(/ /g, '-')
        .replace(/sty/g, '01')
        .replace(/lut/g, '02')
        .replace(/mar/g, '03')
        .replace(/kwi/g, '04')
        .replace(/maj/g, '05')
        .replace(/cze/g, '06')
        .replace(/lip/g, '07')
        .replace(/sie/g, '08')
        .replace(/wrz/g, '09')
        .replace(/paź/g, '10')
        .replace(/lis/g, '11')
        .replace(/gru/g, '12'),
);

class NewsParser extends Parser {
    constructor() {
        super();
        const { content: { domain } } = config;
        this.domain = domain;
    }

    addDomainToUrl(url) {
        return url ? `${this.domain}${url}` : null;
    }

    overwriteDate(date) {
        const dateLabelDelimiter = ' | ';
        const [prefix, time] = date.split(dateLabelDelimiter);

        const replacementDate = new Date(Date.parse(prefix));

        return new Date((replacementDate.toString() === 'Invalid Date')
            ? `${formatDate(prefix)}T${time}`
            : `${replacementDate.getFullYear()}-${replacementDate.getUTCMonth() + 1}-${replacementDate.getDate()}T${time}`)
            .toJSON();
    }

    escapeComma(element) {
        return element.replace(/,/g, '2%C');
    }

    scrapSubfields({ subfields, record }) {
        const result = [];

        if (Array.isArray(record)) {
            if (record.length === 0) {
                record.push({});
            }

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
