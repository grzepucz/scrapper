const MongoConnection = require('./Connector');

class MongoConnectionProvider {
  constructor() {
    if (!MongoConnectionProvider.instance) {
      MongoConnectionProvider.instance = new MongoConnection();
    }
  }

  getInstance() {
    return MongoConnectionProvider.instance;
  }
}

module.exports = MongoConnectionProvider;
