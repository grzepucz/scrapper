// const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
//
// const HADOOP_OP = 'read';

class ScrapperJob {
    constructor({ response, parser: Parser, repository }) {
        // const { targetPath } = file;
        //
        // this.remoteFilePath = targetPath;
        this.response = response;
        // this.fileData = data;
        // this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
        this.repository = repository;
        this.parser = new Parser();
    }

    run() {
        // this.hadoopHandler.handle(this.remoteFilePath)
        //     .then((payload) => this.parser.parse(payload))
        //     .then((data) => this.repository.saveAll(data))
        //     .then(() => console.log('Finished scrapping.'));
        return this.parser.parse(this.response)
            .then((data) => this.repository.saveAll(data))
            .then((data) => data);
    }
}

module.exports = ScrapperJob;
