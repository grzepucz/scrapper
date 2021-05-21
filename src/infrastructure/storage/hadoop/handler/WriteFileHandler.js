const { env } = require('process');
const fs = require('fs');
const { HadoopFile } = require('@domain');
const Handler = require('./Handler');
const {
    ProcessManager, ERROR_MESSAGE, EXIT_MESSAGE,
} = require('../process/ProcessManager');

const DOMAIN_DELIMITER = '#';

const DFS = 'dfs';
const OPERATION = '-appendToFile';
const COMMAND = env.HDFS_BIN || 'hdfs';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

/**
 *
 */
class WriteFileHandler extends Handler {
    /**
     *
     * @param namespace
     * @param domain
     * @param target
     * @returns {string}
     */
    static buildTargetPath(namespace, domain, target) {
        return `${namespace}${domain ? `/${domain}` : ''}/${target}`;
    }

    /**
     * Domain is between delimiters - #
     * @param dirName
     */
    static handleDir(dirName) {
        const domains = [];

        /**
         *
         * @param filteredFiles
         * @param outStream
         */
        const mergeFiles = (filteredFiles, outStream) => {
            for (let iterator = 0; iterator < filteredFiles.length; iterator++) {
                fs.createReadStream(`${dirName}/${filteredFiles[iterator]}`).pipe(outStream);
            }
        };

        /**
         *
         * @param files array
         * @param mergeFile string
         * @param sourcePath
         */
        const flushOldData = (files, mergeFile, sourcePath) => {
            if (files.includes(mergeFile)) {
                fs.unlinkSync(sourcePath);
            }
        };

        /**
         *
         * @param domainNames
         * @param files
         */
        const writeDir = (domainNames, files) => {
            const promises = [];

            for (let iterator = 0; iterator < domainNames.length; iterator++) {
                const domain = domainNames[iterator];
                const mergeFile = `${domain}.csv`;
                const sourcePath = `${dirName}/${mergeFile}`;

                flushOldData(files, mergeFile, sourcePath);
                mergeFiles(
                    files.filter((file) => file.indexOf(domain) > -1),
                    fs.createWriteStream(sourcePath),
                );

                const promise = WriteFileHandler.handleFile({
                    domain,
                    sourcePath,
                    targetPath: HadoopFile.generateDatePath(domain),
                }).then(() => console.log(`${sourcePath} appended into ${domain}`));

                promises.push(promise);
            }

            return Promise.all(promises);
        };

        return new Promise((resolve) => {
            fs.readdir(dirName, (err, files) => {
                files.forEach((file) => {
                    const domain = file.split(DOMAIN_DELIMITER)[1];

                    if (domain) {
                        domains.push(domain);
                    }
                });

                resolve(writeDir([...new Set(domains)], files));
            });
        });
    }

    /**
     *
     * @param file
     * @returns {Promise<unknown>}
     */
    static handleFile(file) {
        const { targetPath, sourcePath, domain } = file;

        return new Promise((resolve, reject) => {
            ProcessManager.spawn(
                COMMAND, [DFS, OPERATION, sourcePath, WriteFileHandler.buildTargetPath(NAMESPACE, domain, targetPath)],
            ).then((child) => {
                // ProcessManager.debug(child);
                console.log(`Saving ${targetPath}`);
                child.stderr.on(ERROR_MESSAGE, (code) => {
                    reject(code);
                });

                child.on(EXIT_MESSAGE, (code) => {
                    console.log(`HDFS write ${targetPath} process exited with code: ${code}`);
                    resolve(code);
                });
            });
        }).then((code) => !code && file);
    }

    /**
     * @param file HadoopFile
     */
    static handle(file) {
        return typeof file === 'string' ? WriteFileHandler.handleDir(file) : WriteFileHandler.handleFile(file);
    }
}

module.exports = WriteFileHandler;
