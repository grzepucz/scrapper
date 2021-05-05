const ConverterError = require('../error/ConverterError');

class ResponseConverter {
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

    static sortByIndex(data, indexNumber = 1) {
        if (!Array.isArray(data)) {
            throw new ConverterError('Data is not an array');
        }

        return data.sort((a, b) => b[indexNumber] - a[indexNumber]);
    }
}

module.exports = ResponseConverter;
