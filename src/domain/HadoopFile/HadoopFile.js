const fs = require('fs');
const { json2csv } = require('json-2-csv');
const { env } = require('process');
const Raven = require('raven');

const CACHE_DIR_NAME = '_cache';
const CSV_EXT = '.csv';

class HadoopFile {
    constructor(fileName, data) {
        this.targetPath = this.generatePath(fileName);
        this.sourcePath = `${env.PWD}/${CACHE_DIR_NAME}/${this.targetPath}`;
        this.data = data;
        this.domain = this.getDomain(fileName);
    }

    getDomain(fileName) {
        const [, domain] = fileName.match(/:\/\/[a-z]{0,3}\.([a-zA-Z]*)/);
        return domain;
    }

    convertToCsv(data) {
        return new Promise((resolve, reject) => {
            const options = {
                emptyFieldValue: 0,
                expandArrayObjects: true,
                prependHeader: false,
                sortHeader: true,
            };
            json2csv(data, (error, csv) => {
                if (error) {
                    Raven.captureException(error);
                    console.log(error);
                    reject(error);
                }

                resolve(csv);
            }, options);
        }).then((csv) => csv).catch((error) => Raven.captureException(error));
    }

    remove() {
        const self = this;

        return new Promise((resolve, reject) => {
            fs.unlink(this.sourcePath, (error) => {
                if (error) {
                    Raven.captureException(error);
                    console.error(error);
                    reject(error);
                } else {
                    console.log(`Removed from /_cache: ${self.sourcePath}`);
                    resolve(self);
                }
            });
        }).then((hadoopFile) => hadoopFile);
    }

    saveCsv() {
        const self = this;

        return new Promise((resolve, reject) => {
            self.convertToCsv(self.data).then((csv) => {
                self.targetPath += CSV_EXT;
                self.sourcePath += CSV_EXT;

                fs.appendFile(self.sourcePath, (csv || self.data), (error) => {
                    if (error) {
                        Raven.captureException(error);
                        console.error(error);
                        reject(error);
                    }

                    resolve(self);
                });
            });
        }).then((hadoopFile) => hadoopFile);
    }

    generatePath(fileName) {
        const slugify = (text) => {
            const [domain] = text.replace(/:/g, '-')
                .replace(/https?.\/\//, '')
                .replace(/\.+/g, '-')
                .split('/');

            return domain.replace(/[^(a-z0-9) -]/g, '');
        };

        const date = new Date().toJSON().slice(0, 10);
        return `${date}-${slugify(fileName)}`;
    }
}

module.exports = HadoopFile;
