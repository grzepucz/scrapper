class HandlerNotImplementedError extends TypeError {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, HandlerNotImplementedError);
    }
}

module.exports = HandlerNotImplementedError;
