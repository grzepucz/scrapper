const { ClientProvider, READ_OPERATION } = require('@infrastructure');
const Raven = require('raven');
const ResponseConverter = require('./utils/ResponseConverter');

const REDUCE_OUTPUT = 'part-00000';

class PrintResultJob {
    constructor() {
        this.readFileHandler = ClientProvider.getClient(READ_OPERATION);
        this.converter = ResponseConverter;
    }

    run({ fileHash }) {
        const filePath = `${fileHash}/${REDUCE_OUTPUT}`;
        const result = new Promise((resolve) => {
            this.readFileHandler.handle(filePath)
                .then((data) => resolve(data));
        }).then((data) => this.converter.convert(data, {}))
            .catch((error) => Raven.captureException(error));

        return result.then((data) => data);
    }
}

module.exports = PrintResultJob;
