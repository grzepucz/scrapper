const mongoose = require('mongoose');
const { env } = require('process');

class MongoConnector {
  constructor() {
    this.connection = mongoose.connect(
      `${env.MONGO_PROTOCOL}://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}/${env.MONGO_DB}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
  }

  getConnection() {
    return mongoose.connection;
  }
}

module.exports = new MongoConnector();
