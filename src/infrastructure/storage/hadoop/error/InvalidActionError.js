class InvalidActionError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidActionError);
    }
}

module.exports = InvalidActionError;
