/**
 *
 */
class ConverterError extends Error {
    /**
     *
     * @param args
     */
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ConverterError);
    }
}

module.exports = ConverterError;
