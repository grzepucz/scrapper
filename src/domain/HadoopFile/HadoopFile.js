const fs = require('fs');
const { json2csv } = require('json-2-csv');
const { env } = require('process');
const Raven = require('raven');

const CACHE_DIR_NAME = '_cache';
const CSV_EXT = '.csv';

/**
 *
 */
class HadoopFile {
    /**
     *
     * @param fileName
     * @param data
     */
    constructor(fileName, data) {
        this.domain = HadoopFile.getDomain(fileName);
        this.targetPath = HadoopFile.generatePath(fileName, this.domain);
        this.sourcePath = `${env.PWD}/${CACHE_DIR_NAME}/${this.targetPath}`;
        this.data = data;
    }

    /**
     *
     * @returns {string}
     */
    static getDir() {
        return `${env.PWD}/${CACHE_DIR_NAME}`;
    }

    /**
     *
     * @param fileName
     * @returns {*}
     */
    static getDomain(fileName) {
        const domain = fileName.split('.')[1];
        return domain || fileName;
    }

    /**
     *
     * @param data
     * @returns {Promise<*>}
     */
    convertToCsv(data) {
        return new Promise((resolve, reject) => {
            const options = {
                emptyFieldValue: 'null',
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

    /**
     *
     * @returns {Promise<*>}
     */
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

    /**
     *
     * @returns {Promise<*>}
     */
    saveCsv() {
        const self = this;

        return new Promise((resolve, reject) => {
            self.convertToCsv(self.data).then((csv) => {
                self.targetPath += CSV_EXT;
                self.sourcePath += CSV_EXT;
                self.dataCsv = `${csv}\n`;

                fs.appendFile(self.sourcePath, self.dataCsv, (error) => {
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

    /**
     *
     * @param fileName
     * @param domain
     * @returns {string}
     */
    static generatePath(fileName, domain) {
        const slugify = (text) => {
            const [uri] = text.replace(/:/g, '-')
                .replace(/https?.\/\//, '')
                .replace(/\.+/g, '-')
                .split('/');

            return uri.replace(/[^(a-z0-9) -]/g, '')
                .replace(domain, `#${domain}#`);
        };

        const date = new Date().toJSON()
            .slice(0, 10)
            .replace(/:/g, '-')
            .replace('T', '-');

        const fileHash = Math.floor(Math.random() * 1000);

        return `${date}-${slugify(fileName)}-${fileHash}`;
    }

    /**
     *
     * @param fileName
     * @param domain
     * @returns {string}
     */
    static generateDatePath(domain) {
        return `${new Date().toJSON()
            .slice(0, 10)
            .replace(/:/g, '-')
            .replace('T', '-')}-${domain}`;
    }
}

module.exports = HadoopFile;
