class ConverterError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, ConverterError);
    }
}

module.exports = ConverterError;
