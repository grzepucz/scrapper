const { env } = require('process');
const Handler = require('./Handler');
const ProcessManager = require('../process/ProcessManager');

const DFS = 'dfs';
const OPERATION = '-appendToFile';
const COMMAND = env.HDFS_BIN || 'hdfs';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

const ERROR_MESSAGE = 'error';
const EXIT_MESSAGE = 'exit';

class WriteFileHandler extends Handler {
    /**
     * @param file HadoopFile
     */
    static handle(file) {
        const { targetPath, sourcePath } = file;

        return new Promise((resolve, reject) => {
            ProcessManager.spawn(COMMAND, [DFS, OPERATION, sourcePath, `${NAMESPACE}/${targetPath}`])
                .then((child) => {
                    console.log(`Saving ${targetPath}`);
                    child.stderr.on(ERROR_MESSAGE, (code) => {
                        console.error(code);
                        reject(code);
                    });

                    child.on(EXIT_MESSAGE, (code) => {
                        console.log(`HDFS write process exited with code: ${code}`);
                        resolve(code);
                    });
                });
        }).then((code) => !code && file);
    }
}

module.exports = WriteFileHandler;
