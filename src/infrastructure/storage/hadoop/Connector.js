const { WebHDFSClient } = require('node-webhdfs');
const { env } = require('process');

class HadoopConnector {
  constructor() {
    this.connection = new WebHDFSClient({
      user: env.HADOOP_NODE_USER,
      namenode_host: env.HADOOP_NODE_HOST,
      namenode_port: env.HADOOP_HOST_PORT,
    });
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new HadoopConnector();
