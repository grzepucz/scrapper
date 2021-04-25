const { MapReduceHandler, ReadFileHandler, REDUCE_OUTPUT } = require('@infrastructure');
const ResponseConverter = require('./utils/ResponseConverter');

class MapReduceJob {
    constructor() {
        this.mapReduceHandler = MapReduceHandler;
        this.readFileHandler = ReadFileHandler;
        this.converter = ResponseConverter;
    }

    run(domain, action) {
        return new Promise((resolve) => {
            this.mapReduceHandler.handle({ domain, action })
                .then((fileHash) => this.readFileHandler.handle(`${fileHash}/${REDUCE_OUTPUT}`))
                .then((data) => resolve(data));
        })
            .then((data) => this.converter.convert(data, {}))
            .then((converted) => this.converter.sortByIndex(converted, 1));
    }
}

module.exports = MapReduceJob;
