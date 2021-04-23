const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');

const HADOOP_OP = 'read';

class ScrapperJob {
    constructor({ file, parser: Parser, repository }) {
        const { targetPath } = file;

        this.remoteFilePath = targetPath;
        this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
        this.repository = repository;
        this.parser = new Parser();
    }

    run() {
        this.hadoopHandler.handle(this.remoteFilePath)
            .then((payload) => this.parser.parse(payload))
            .then((data) => this.repository.saveAll(data))
            .then(() => console.log('Finished scrapping.'));
    }
}

module.exports = ScrapperJob;
