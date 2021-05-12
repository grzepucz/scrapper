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

class WriteFileHandler extends Handler {
    static buildTargetPath(namespace, domain, target) {
        return `${namespace}${domain ? `/${domain}` : ''}/${target}`;
    }

    /**
     * Domain is between delimiters - #
     * @param dirName
     */
    static handleDir(dirName) {
        const domains = [];

        const mergeFiles = (filteredFiles, outStream) => {
            for (let iterator = 0; iterator < filteredFiles.length; iterator++) {
                fs.createReadStream(`${dirName}/${filteredFiles[iterator]}`).pipe(outStream);
            }
        };

        /**
         *
         * @param files array
         * @param mergeFile string
         */
        const flushOldData = (files, mergeFile, sourcePath) => {
            if (files.includes(mergeFile)) {
                fs.unlinkSync(sourcePath);
            }
        };

        const writeDir = (domainNames, files) => {
            for (let iterator = 0; iterator < domainNames.length; iterator++) {
                const domain = domainNames[iterator];
                const mergeFile = `${domain}.csv`;
                const sourcePath = `${dirName}/${mergeFile}`;

                flushOldData(files, mergeFile, sourcePath);
                mergeFiles(
                    files.filter((file) => file.indexOf(domain) > -1),
                    fs.createWriteStream(sourcePath),
                );

                WriteFileHandler.handleFile({
                    domain,
                    sourcePath,
                    targetPath: HadoopFile.generatePath(sourcePath, domain),
                }).then(() => console.log(`${sourcePath} appended into ${domain}`));
            }
        };

        fs.readdir(dirName, (err, files) => {
            files.forEach((file) => {
                const domain = file.split(DOMAIN_DELIMITER)[1];

                if (domain) {
                    domains.push(domain);
                }
            });

            writeDir([...new Set(domains)], files);
        });
    }

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
