class NotImplementedError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, NotImplementedError);
    }
}

module.exports = NotImplementedError;
