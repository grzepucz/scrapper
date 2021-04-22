const WebClient = require('@infrastructure/client/WebClient');
const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const HadoopFile = require('@domain/HadoopFile/HadoopFile');
const { env } = require('process');
const ScrapperJob = require('../scrapper/ScrapperJob');

const DEFAULT_PAGE = 'https://www.jbzd.com.pl/';
const HADOOP_OP = 'write';

class SurferJob {
    constructor() {
        this.pageLocation = env.PAGE_LOCATION || DEFAULT_PAGE;
        this.client = new WebClient();
        this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
    }

    run() {
        return new Promise((resolve) => resolve(this.client.getPage(this.pageLocation)))
            .then((response) => new HadoopFile(this.pageLocation, response))
            .then((file) => file.save())
            .then((hadoopFile) => this.hadoopHandler.handle(hadoopFile))
            .then((file) => file.remove())
            .then((file) => new ScrapperJob(file).scrap());
    }
}

module.exports = SurferJob;
