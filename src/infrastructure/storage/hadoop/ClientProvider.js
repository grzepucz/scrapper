const MapReduceHandler = require('./handler/MapReduceHandler');
const ReadFileHandler = require('./handler/ReadFileHandler');
const WriteFileHandler = require('./handler/WriteFileHandler');
const InvalidActionError = require('./error/InvalidActionError');

const READ_OPERATION = 'read';
const WRITE_OPERATION = 'write';
const MAP_REDUCE_OPERATION = 'mapreduce';

/**
 *
 */
class ClientProvider {
    /**
     *
     * @param operation
     * @returns {ReadFileHandler|WriteFileHandler|MapReduceHandler}
     */
    static getClient(operation) {
        switch (operation) {
        case READ_OPERATION:
            return ReadFileHandler;
        case WRITE_OPERATION:
            return WriteFileHandler;
        case MAP_REDUCE_OPERATION:
            return MapReduceHandler;
        default:
            throw new InvalidActionError();
        }
    }
}

module.exports = {
    ClientProvider,
    READ_OPERATION,
    WRITE_OPERATION,
    MAP_REDUCE_OPERATION,
};
