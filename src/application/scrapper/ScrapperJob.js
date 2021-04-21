const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const ArticleParser = require('@domain/Article/parser/ArticleParser');

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
      .then((payload) => this.parser.parseHTML(payload));
  }
}

module.exports = ScrapperJob;
