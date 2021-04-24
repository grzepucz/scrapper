const fs = require('fs');
const { env } = require('process');
const Raven = require('raven');

const CACHE_DIR_NAME = '_cache';

class HadoopFile {
    constructor(fileName, data) {
        this.targetPath = this.generatePath(fileName);
        this.sourcePath = `${env.PWD}/${CACHE_DIR_NAME}/${this.targetPath}`;
        this.data = data;
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

    save() {
        const self = this;

        return new Promise((resolve, reject) => {
            if (self.sourcePath && self.data) {
                fs.appendFile(self.sourcePath, self.data, (error) => {
                    if (error) {
                        Raven.captureException(error);
                        console.error(error);
                        reject(error);
                    }

                    resolve(self);
                });
            }
        }).then((hadoopFile) => hadoopFile);
    }

    generatePath(fileName) {
        const slugify = (text) => text.replace(/:/g, '-')
            .replace(/^https?:\/\//, '')
            .replace(/\.+/g, '-')
            .replace(/[^(a-z0-9) -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        const date = new Date().toJSON().slice(0, 19);
        return slugify(`${date.replace('T', '-')}-${fileName}`);
    }
}

module.exports = HadoopFile;
