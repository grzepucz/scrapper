const { env } = require('process');
const { path } = require('path');
const ProcessManager = require('../process/ProcessManager');
const Handler = require('./Handler');

const JAR = 'jar';
const JAR_EXT = '.jar';
const JAR_PATH = '/bin';
const COMMAND = env.YARN_BIN || 'yarn';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

const ERROR_MESSAGE = 'error';
const DATA_MESSAGE = 'data';
const EXIT_MESSAGE = 'exit';

class MapReduceHandler extends Handler {
    static buildInputPath(domain) {
        return `${NAMESPACE}${domain ? `/${domain}` : ''}`;
    }

    static getJarByAction(action) {
        switch (action) {
        case 'MemesInCategory':
            return `${env.PWD}/${JAR_PATH}/MemesInCategory${JAR_EXT}`;
        default:
            return null;
        }
    }

    /**
     *
     * @param reducer Object
     */
    static handle(reducer) {
        const { domain, action } = reducer;
        const outputDir = `${NAMESPACE}/${Math.random()}-${Date.now()}`;

        return new Promise((resolve, reject) => {
            ProcessManager.spawn(COMMAND, [JAR, MapReduceHandler.getJarByAction(action), MapReduceHandler.buildInputPath(domain), outputDir])
                .then((child) => {
                    console.log('MapReduce');
                    child.stderr.on(ERROR_MESSAGE, (code) => {
                        console.error(code);
                        reject(code);
                    });

                    child.stdout.on(DATA_MESSAGE, (chunk) => {
                        console.log(chunk.toString());
                    });

                    child.on(EXIT_MESSAGE, (code) => {
                        // resolve(Buffer.concat(chunks).toString('utf8'));
                        console.log(`HDFS read process exited with code: ${code}`);
                        resolve(true);
                    });
                });
        }).then(() => outputDir);
    }
}

module.exports = MapReduceHandler;
