/**
 *
 */
class InvalidActionError extends Error {
    /**
     *
     * @param args
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, InvalidActionError);
    }
}

module.exports = InvalidActionError;
