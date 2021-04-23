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
        url: 'https://www.jbzd.com.pl/top/dzien',
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
            .then((response) => new HadoopFile(url, response))
            .then((file) => file.save())
            .then((hadoopFile) => self.hadoopHandler.handle(hadoopFile))
            .then((file) => file.remove())
            .then((file) => new ScrapperJob({ file, parser, repository }).run());
    }

    runWithPagination(limit = 3) {
        const promises = [];
        let counter = 1;

        while (counter <= limit) {
            DEFAULT.forEach((page) => {
                const { url, pagination } = page;
                const paginatedUrl = pagination(url, counter);
                const paginated = { ...page, url: paginatedUrl };

                promises.push(this.run(paginated).then(() => console.log(`Processed: ${paginatedUrl}`)));
            });

            counter += 1;
        }

        return Promise.all(promises)
            .then(() => `Processed all ${limit} promises.`);
    }
}

module.exports = SurferJob;
