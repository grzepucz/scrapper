const { env } = require('process');
const {
    ProcessManager, ERROR_MESSAGE, DATA_MESSAGE, EXIT_MESSAGE,
} = require('../process/ProcessManager');
const Handler = require('./Handler');

const DFS = 'dfs';
const OPERATION = '-cat';
const COMMAND = env.HDFS_BIN || 'hdfs';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

/**
 *
 */
class ReadFileHandler extends Handler {
    /**
     *
     * @param path string
     */
    static handle(path) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            ProcessManager.spawn(COMMAND, [DFS, OPERATION, `${NAMESPACE}/${path}`])
                .then((child) => {
                    ProcessManager.debug(child);
                    console.log(`Reading ${NAMESPACE}/${path}`);
                    child.stderr.on(ERROR_MESSAGE, (code) => {
                        reject(code);
                    });

                    child.stdout.on(DATA_MESSAGE, (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });

                    child.on(EXIT_MESSAGE, (code) => {
                        resolve(Buffer.concat(chunks).toString('utf8'));
                        console.log(`HDFS read ${path} process exited with code: ${code}`);
                    });
                });
        }).then((data) => data);
    }
}

module.exports = ReadFileHandler;
