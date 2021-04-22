const WebClient = require('@infrastructure/client/WebClient');
const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const HadoopFile = require('@domain/HadoopFile/HadoopFile');
const { env } = require('process');
const ScrapperJob = require('../scrapper/ScrapperJob');

const DEFAULT_PAGE = 'https://www.jbzd.com.pl/top/dzien/';
const HADOOP_OP = 'write';

class SurferJob {
    constructor() {
        this.pageLocation = env.PAGE_LOCATION || DEFAULT_PAGE;
        this.client = new WebClient();
        this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
    }

    run() {
        const self = this;
        return new Promise((resolve) => resolve(self.client.getPage(self.pageLocation)))
            .then((response) => new HadoopFile(self.pageLocation, response))
            .then((file) => file.save())
            .then((hadoopFile) => self.hadoopHandler.handle(hadoopFile))
            .then((file) => file.remove())
            .then((file) => new ScrapperJob(file).scrap());
    }
}

module.exports = SurferJob;
