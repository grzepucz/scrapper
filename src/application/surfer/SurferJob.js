const WebClient = require('@infrastructure/client/WebClient');
const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const HadoopFile = require('@domain/HadoopFile/HadoopFile');
const { env } = require('process');
const ScrapperJob = require('../scrapper/ScrapperJob');

const DEFAULT_PAGE = 'https://www.jbzd.com.pl/top/dzien';
const HADOOP_OP = 'write';

class SurferJob {
    constructor() {
        this.pageLocation = env.PAGE_LOCATION || DEFAULT_PAGE;
        this.client = new WebClient();
        this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
    }

    run(page) {
        const self = this;
        return new Promise((resolve) => resolve(self.client.getPage(page || self.pageLocation)))
            .then((response) => new HadoopFile(page || self.pageLocation, response))
            .then((file) => file.save())
            .then((hadoopFile) => self.hadoopHandler.handle(hadoopFile))
            .then((file) => file.remove())
            .then((file) => new ScrapperJob(file).scrap());
    }

    runWithPagination(limit = 1) {
        const promises = [];
        let counter = 0;

        while (++counter <= limit) {
            const page = `${this.pageLocation}/${counter}`;
            console.log(page);
            promises.push(this.run(page).then(() => console.log(`Processed: ${page}`)));
        }

        return Promise.all(promises).then(() => `Processed all ${limit} promises.`);
    }
}

module.exports = SurferJob;
