const { HadoopFile } = require('@domain');
const {
    WebClient,
    ClientProvider,
    ArticleParser,
    ArticleRepository,
    NewsParser,
    NewsRepository,
    UfcParser,
    UfcRepository,
    WRITE_OPERATION,
} = require('@infrastructure');
const ScrapperJob = require('../scrapper/ScrapperJob');
const PurgerJob = require('../purger/PurgerJob');

const ONLY_UFC = [
    {
        url: 'http://statleaders.ufc.com/en/career',
        parser: UfcParser,
        repository: UfcRepository,
        pagination: null,
    },
    {
        url: 'http://statleaders.ufc.com/en/fight',
        parser: UfcParser,
        repository: UfcRepository,
    },
    {
        url: 'http://statleaders.ufc.com/en/fight-comb',
        parser: UfcParser,
        repository: UfcRepository,
    },
    {
        url: 'http://statleaders.ufc.com/en/round',
        parser: UfcParser,
        repository: UfcRepository,
    },
    {
        url: 'http://statleaders.ufc.com/en/round-comb',
        parser: UfcParser,
        repository: UfcRepository,
    },
    {
        url: 'http://statleaders.ufc.com/en/event',
        parser: UfcParser,
        repository: UfcRepository,
    },
];

const DEFAULT = [
    {
        url: 'https://www.jbzd.com.pl/str',
        parser: ArticleParser,
        repository: ArticleRepository,
        pagination: (href, page) => `${href}/${page}`,
    },
    {
        url: 'https://api.meczyki.pl/api/news/get-last-news-by-date?page=1',
        parser: NewsParser,
        repository: NewsRepository,
        pagination: (href, page) => `${href.slice(0, href.length - 1)}${page}`,
    },
    // ...ONLY_UFC,
];

/**
 *
 */
class SurferJob {
    constructor() {
        this.pages = DEFAULT;
        this.client = new WebClient();
        this.hadoopHandler = ClientProvider.getClient(WRITE_OPERATION);
    }

    /**
     *
     * @param page
     * @returns {Promise<*>}
     */
    run(page) {
        const self = this;
        const { url, parser, repository } = page;

        return new Promise((resolve) => resolve(self.client.getPage(url)))
            .then((response) => new ScrapperJob({ response, parser, repository })
                .run().then((data) => new HadoopFile(url, data)))
            .then((data) => data.saveCsv())
            .then((file) => file);
    }

    /**
     *
     * @param start
     * @param limit
     * @returns {Promise<*>}
     */
    runWithPagination({ start = '1', limit = '1' }) {
        const promises = [];
        const self = this;
        let counter = Number.parseInt(start, 10);
        const max = Number.parseInt(limit, 10) + Number.parseInt(start, 10);

        while (counter < max) {
            this.pages.forEach((page) => {
                const { url, pagination } = page;

                if (pagination) {
                    const paginatedUrl = pagination(url, counter);
                    const paginated = { ...page, url: paginatedUrl };

                    promises.push(self.run(paginated).then(() => console.log(`Processed: ${paginatedUrl}`)));
                } else if (counter <= start) {
                    promises.push(self.run(page).then(() => console.log(`Processed: ${url}`)));
                }
            });

            counter += 1;
        }

        return Promise.all(promises)
            .then(() => self.hadoopHandler.handle(HadoopFile.getDir()))
            .then(() => new PurgerJob().run());
    }
}

module.exports = SurferJob;
