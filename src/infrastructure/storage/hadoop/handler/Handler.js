const HandlerNotImplementedError = require('../error/HandlerNotImplementedError');

class Handler {
    static handle() {
        if (this === Handler) {
            throw new HandlerNotImplementedError('Can not call static abstract method foo.');
        } else if (this.handle === Handler.handle) {
            throw new HandlerNotImplementedError('Please implement static abstract method foo.');
        } else {
            throw new HandlerNotImplementedError('Do not call static abstract method foo from child.');
        }
    }

    static spawnProcess() {
        if (this === Handler) {
            throw new HandlerNotImplementedError('Can not call static abstract method foo.');
        } else if (this.spawnProcess === Handler.spawnProcess) {
            throw new HandlerNotImplementedError('Please implement static abstract method foo.');
        } else {
            throw new HandlerNotImplementedError('Do not call static abstract method foo from child.');
        }
    }

    constructor() {
        if (this.constructor === Handler) {
            throw new HandlerNotImplementedError('Can not construct abstract class.');
        }
        if (this.handle === Handler.prototype.handle) {
            throw new HandlerNotImplementedError('Please implement abstract method foo.');
        }
        if (this.spawnProcess === Handler.prototype.spawnProcess) {
            throw new HandlerNotImplementedError('Please implement abstract method foo.');
        }
    }

    handle() {
        throw new HandlerNotImplementedError('Do not call abstract method foo from child.');
    }

    spawnProcess() {
        throw new HandlerNotImplementedError('Do not call abstract method foo from child.');
    }
}

module.exports = Handler;
