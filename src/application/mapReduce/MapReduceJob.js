const Raven = require('raven');
const { ClientProvider, MAP_REDUCE_OPERATION } = require('@infrastructure');
const ResponseConverter = require('./utils/ResponseConverter');

/**
 * Job to execute map reduce action
 */
class MapReduceJob {
    /**
     *
     */
    constructor() {
        this.mapReduceHandler = ClientProvider.getClient(MAP_REDUCE_OPERATION);
        this.converter = ResponseConverter;
    }

    /**
     * Method called to run job.
     *
     * @param parameters
     * @returns {Promise<*>}
     */
    run(parameters) {
        return new Promise((resolve) => {
            this.mapReduceHandler.handle(parameters)
                .then((fileHash) => resolve(fileHash));
        }).then((data) => data)
            .catch((error) => Raven.captureException(error));
    }
}

module.exports = MapReduceJob;
