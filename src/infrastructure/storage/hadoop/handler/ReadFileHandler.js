const { env } = require('process');
const { spawn } = require('child_process');

const DFS = 'dfs';
const OPERATION = '-cat';
const COMMAND = env.HDFS_BIN || 'hdfs';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

const ERROR_MESSAGE = 'error';
const DATA_MESSAGE = 'data';
const EXIT_MESSAGE = 'exit';

class ReadFileHandler {
    /**
     * @param path string
     */
    static handle(path) {
        const child = new Promise((resolve, reject) => {
            const chunks = [];
            this.spawn = spawn(COMMAND, [DFS, OPERATION, `${NAMESPACE}/${path}`]);

            this.spawn.stderr.on(ERROR_MESSAGE, (code) => {
                console.error(code);
                reject(code);
            });

            this.spawn.stdout.on(DATA_MESSAGE, (chunk) => {
                chunks.push(Buffer.from(chunk));
            });

            this.spawn.on(EXIT_MESSAGE, (code) => {
                resolve(Buffer.concat(chunks).toString('utf8'));
                console.log(`HDFS process exited with code: ${code}`);
            });
        });

        return child.then((data) => data);
    }
}

module.exports = ReadFileHandler;
