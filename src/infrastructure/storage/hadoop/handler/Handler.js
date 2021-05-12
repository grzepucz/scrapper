const HandlerNotImplementedError = require('../error/HandlerNotImplementedError');

/**
 *
 */
class Handler {
    /**
     *
     */
    static handle() {
        if (this === Handler) {
            throw new HandlerNotImplementedError();
        } else if (this.handle === Handler.handle) {
            throw new HandlerNotImplementedError();
        } else {
            throw new HandlerNotImplementedError();
        }
    }

    /**
     *
     */
    static spawnProcess() {
        if (this === Handler) {
            throw new HandlerNotImplementedError();
        } else if (this.spawnProcess === Handler.spawnProcess) {
            throw new HandlerNotImplementedError();
        } else {
            throw new HandlerNotImplementedError();
        }
    }

    /**
     *
     */
    constructor() {
        if (this.constructor === Handler) {
            throw new HandlerNotImplementedError();
        }
        if (this.handle === Handler.prototype.handle) {
            throw new HandlerNotImplementedError();
        }
        if (this.spawnProcess === Handler.prototype.spawnProcess) {
            throw new HandlerNotImplementedError();
        }
    }

    /**
     *
     */
    handle() {
        throw new HandlerNotImplementedError();
    }

    /**
     *
     */
    spawnProcess() {
        throw new HandlerNotImplementedError();
    }
}

module.exports = Handler;
