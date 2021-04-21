const { env } = require('process');
const Raven = require('raven');
const mongoose = require('mongoose');

const DISCONNECTED_STATUS = 0;
const NOT_INIT_CONNECTION_STATUS = 99;

const ERROR_EVENT = 'error';

class MongoConnection {
  constructor() {
    this.mongooseUrl = `mongodb://${env.DOCUMENTDB_USER}:${env.DOCUMENTDB_PASSWORD}@${env.DOCUMENTDB_HOST}/${env.DOCUMENTDB_DATABASE}`;
    this.connection = null;
  }

  getConnection() {
    const state = this.connection?.readyState || 0;
    const checkConnectionStatus = (status) => (status === DISCONNECTED_STATUS || status === NOT_INIT_CONNECTION_STATUS);
    const self = this;

    return new Promise((resolve, reject) => {
      if (!self.connection || checkConnectionStatus(state)) {
        self.getConnectionMongo()
          .then((connection) => {
            connection.on(ERROR_EVENT, (error) => {
              Raven.captureException(error);
              reject(error);
            });

            self.connection = connection;
            resolve(self.connection);
          })
          .catch((error) => {
            Raven.captureException(error);
            reject(error);
          });
      } else {
        resolve(self.connection);
      }
    });
  }

  getConnectionMongo() {
    const self = this;
    return new Promise((resolve, reject) => {
      mongoose.connect(self.mongooseUrl, {
        poolSize: 200,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        heartbeatFrequencyMS: 1500,
        serverSelectionTimeoutMS: 5000,
      })
        .then(() => resolve(mongoose.connection))
        .catch((error) => {
          Raven.captureException(error);
          reject(error);
        });
    });
  }
}

module.exports = new MongoConnection();
