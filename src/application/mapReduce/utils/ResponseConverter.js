const ConverterError = require('../error/ConverterError');

/**
 * Response converter class.
 */
class ResponseConverter {
    /**
     * Converts MapReduce output into JSON array.
     *
     * @param data
     * @param options
     * @returns {*}
     */
    static convert(data, options) {
        const {
            rowSeparator = '\n',
            columnSeparator = '\t',
        } = options;

        if (!data) {
            throw new ConverterError('Data is null');
        }

        const result = [];
        const rows = data.split(rowSeparator);

        rows.forEach((row) => {
            const values = [];
            const chunks = row.split(columnSeparator);
            chunks.forEach((chunk) => values.push(chunk));
            result.push(values);
        });

        return ResponseConverter.sortByIndex(result, 1);
    }

    /**
     * Sorts map reduce output by index
     *
     * @param data
     * @param indexNumber
     * @returns {*}
     */
    static sortByIndex(data, indexNumber = 1) {
        if (!Array.isArray(data)) {
            throw new ConverterError('Data is not an array');
        }

        return data.filter((item) => item[0] !== null && item[0] !== 'null')
            .sort((a, b) => Number.parseInt(b[indexNumber], 10) - Number.parseInt(a[indexNumber], 10));
    }
}

module.exports = ResponseConverter;
