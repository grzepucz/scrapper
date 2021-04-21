const fs = require('fs');
const { env } = require('process');
const Raven = require('raven');

const CACHE_DIR_NAME = '_cache';

class HadoopFile {
  constructor(fileName, data) {
    this.targetPath = this.generatePath(fileName);
    this.sourcePath = `${env.PWD}/${CACHE_DIR_NAME}/${this.targetPath}`;
    this.data = JSON.stringify(data);
  }

  remove() {
    const self = this;

    const removal = new Promise((resolve, reject) => {
      fs.unlink(this.sourcePath, (error) => {
        if (error) {
          Raven.captureException(error);
          console.error(error);
          reject(error);
        } else {
          console.log(`Removed from /_cache: ${self.sourcePath}`);
          resolve(true);
        }
      });
    });

    return removal.then(() => self);
  }

  save() {
    const self = this;

    const file = new Promise((resolve, reject) => {
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
    });

    return file.then(() => self);
  }

  generatePath(fileName) {
    const slugify = (text) => text.replace(/:/g, '-')
      .replace('http', '')
      .replace(/\.+/g, '-')
      .replace(/[^(a-z0-9) -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const date = new Date().toJSON().slice(0, 16);
    return slugify(`${date.replace('T', '-')}-${fileName}`);
  }
}

module.exports = HadoopFile;
