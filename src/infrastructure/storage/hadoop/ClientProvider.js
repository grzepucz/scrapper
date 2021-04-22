const ReadFileHandler = require('./handler/ReadFileHandler');
const WriteFileHandler = require('./handler/WriteFileHandler');
const InvalidActionError = require('./error/InvalidActionError');

const READ_OPERATION = 'read';
const WRITE_OPERATION = 'write';

class ClientProvider {
    static getClient(operation) {
        switch (operation) {
        case READ_OPERATION:
            return ReadFileHandler;
        case WRITE_OPERATION:
            return WriteFileHandler;
        default:
            throw new InvalidActionError();
        }
    }
}

module.exports = ClientProvider;
