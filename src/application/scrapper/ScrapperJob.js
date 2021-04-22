const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const ArticleParser = require('@domain/Article/parser/ArticleParser');
const ArticleRepository = require('@infrastructure/storage/mongo/repository/ArticleRepository');

const HADOOP_OP = 'read';

class ScrapperJob {
    constructor(file) {
        const { targetPath } = file;

        this.remoteFilePath = targetPath;
        this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
        this.parser = new ArticleParser();
    }

    scrap() {
        this.hadoopHandler.handle(this.remoteFilePath)
            .then((payload) => this.parser.parseHTML(payload))
            .then((data) => ArticleRepository.saveAll(data))
            .then(() => console.log('Finished scrapping.'));
    }
}

module.exports = ScrapperJob;
