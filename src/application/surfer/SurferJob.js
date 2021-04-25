const WebClient = require('@infrastructure/client/WebClient');
const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const ArticleParser = require('@infrastructure/parser/model/article/ArticleParser');
const ArticleRepository = require('@infrastructure/storage/mongo/repository/ArticleRepository');
const NewsParser = require('@infrastructure/parser/model/news/NewsParser');
const NewsRepository = require('@infrastructure/storage/mongo/repository/NewsRepository');
const HadoopFile = require('@domain/HadoopFile/HadoopFile');
const ScrapperJob = require('../scrapper/ScrapperJob');

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
];
const HADOOP_OP = 'write';

class SurferJob {
    constructor() {
        this.pages = DEFAULT;
        this.client = new WebClient();
        this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
    }

    run(page) {
        const self = this;
        const { url, parser, repository } = page;

        return new Promise((resolve) => resolve(self.client.getPage(url)))
            .then((response) => new ScrapperJob({ response, parser, repository })
                .run().then((data) => new HadoopFile(url, data)))
            .then((data) => data.saveCsv())
            .then((file) => self.hadoopHandler.handle(file))
            .then((file) => file.remove())
            .then((file) => file);
    }

    runWithPagination({ start = '1', limit = '1' }) {
        const promises = [];
        let counter = Number.parseInt(start, 10);
        const max = Number.parseInt(limit, 10) + Number.parseInt(start, 10);

        while (counter < max) {
            DEFAULT.forEach((page) => {
                const { url, pagination } = page;
                const paginatedUrl = pagination(url, counter);
                const paginated = { ...page, url: paginatedUrl };

                promises.push(this.run(paginated).then(() => console.log(`Processed: ${paginatedUrl}`)));
            });

            counter += 1;
        }

        return Promise.all(promises)
            .then((data) => data);
    }
}

module.exports = SurferJob;
