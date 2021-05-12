const { env } = require('process');
const Raven = require('raven');
const mongoose = require('mongoose');

const DISCONNECTED_STATUS = 0;
const NOT_INIT_CONNECTION_STATUS = 99;

const ERROR_EVENT = 'error';

/**
 *
 */
class MongoConnection {
    /**
     *
     */
    constructor() {
        this.mongooseUrl = `${env.MONGO_PROTOCOL}://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}/${env.MONGO_DB}?retryWrites=true&w=majority`;
        this.connection = null;
    }

    /**
     *
     * @returns {number|"closed"|"closing"|"connecting"|"open"|ActiveX.XmlDocumentReadyState|"ended"|"live"|ActiveX.XslProcessorReadyState|"complete"|"interactive"|"loading"|"closed"|"ended"|"open"|"done"|"pending"}
     */
    getCurrentConnectionState() {
        if (!this.connection) {
            return DISCONNECTED_STATUS;
        }

        return this.connection.readyState || DISCONNECTED_STATUS;
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    getConnection() {
        const state = this.getCurrentConnectionState();
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

    /**
     *
     * @returns {Promise<unknown>}
     */
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
