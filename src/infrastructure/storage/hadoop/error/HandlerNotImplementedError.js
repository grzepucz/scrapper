/**
 *
 */
class HandlerNotImplementedError extends TypeError {
    /**
     *
     * @param args
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, HandlerNotImplementedError);
    }
}

module.exports = HandlerNotImplementedError;
