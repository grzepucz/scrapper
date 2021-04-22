const { env } = require('process');
const { spawn } = require('child_process');

const DFS = 'dfs';
const OPERATION = '-appendToFile';
const COMMAND = env.HDFS_BIN || 'hdfs';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

const ERROR_MESSAGE = 'error';
const EXIT_MESSAGE = 'exit';

class WriteFileHandler {
    /**
     * @param file HadoopFile
     */
    static handle(file) {
        const { targetPath, sourcePath } = file;

        const child = new Promise((resolve, reject) => {
            this.spawn = spawn(COMMAND, [DFS, OPERATION, sourcePath, `${NAMESPACE}/${targetPath}`]);

            this.spawn.stderr.on(ERROR_MESSAGE, (code) => {
                console.error(code);
                reject(code);
            });

            this.spawn.on(EXIT_MESSAGE, (code) => {
                console.log(`HDFS process exited with code: ${code}`);
                resolve(true);
            });
        });

        return child.then(() => file);
    }
}

module.exports = WriteFileHandler;
