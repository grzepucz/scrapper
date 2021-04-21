const WebClient = require('@infrastructure/client/WebClient');
const HadoopClient = require('@infrastructure/storage/hadoop/ClientProvider');
const HadoopFile = require('@domain/HadoopFile/HadoopFile');

const DEFAULT_PAGE = 'https://www.jbzd.com.pl/';
const HADOOP_OP = 'write';

class SurferJob {
  constructor(url) {
    this.pageToSurf = url || DEFAULT_PAGE;
    this.client = new WebClient();
    this.hadoopHandler = HadoopClient.getClient(HADOOP_OP);
  }

  run() {
    return new Promise((resolve) => resolve(this.client.getPage(this.pageToSurf)))
      .then((response) => new HadoopFile(this.pageToSurf, response))
      .then((file) => file.save())
      .then((hadoopFile) => this.hadoopHandler.handle(hadoopFile))
      .then((file) => file.remove())
      .then(() => console.log('Finished surfing'));
  }
}

module.exports = SurferJob;
