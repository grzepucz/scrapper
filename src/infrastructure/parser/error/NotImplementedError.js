/**
 *
 */
class NotImplementedError extends Error {
    /**
     *
     * @param args
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, NotImplementedError);
    }
}

module.exports = NotImplementedError;
