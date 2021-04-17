const Connector = require('./Connector');

class HadoopClient {
  constructor() {
    this.connection = Connector.getConnection();
  }

  appendFile(fileLocation, data) {
    this.connection.append(fileLocation, JSON.stringify(data), (err, success) => {
      if (err instanceof Error) {
        console.log(err);
      }

      if (success) {
        console.log('success:');
        console.log(success);
      }
    });
  }

  readFile(fileLocation) {
    const remoteFileStream = this.connection.createReadStream(fileLocation);

    remoteFileStream.on('error', (err) => {
      // Do something with the error
      console.log(err);
    });

    remoteFileStream.on('data', (chunk) => {
      // Do something with the data chunk
      console.log(chunk.toString());
    });

    remoteFileStream.on('finish', () => {
      // Upload is done
    }).pipe(process.stdout);
  }
}

module.exports = HadoopClient;
