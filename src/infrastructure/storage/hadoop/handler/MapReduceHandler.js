const { env } = require('process');
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

const MEMES_IN_CATEGORY_MR = 'MemesInCategory';
const MOST_COMMENTED_NEWS_MR = 'MostCommentedNews';
const REDUCE_OUTPUT = 'part-00000';

class MapReduceHandler extends Handler {
    static buildInputPath(domain) {
        return `${NAMESPACE}${domain ? `/${domain}` : ''}`;
    }

    static getJarByAction(action) {
        switch (action) {
        case MEMES_IN_CATEGORY_MR:
            return `${env.PWD}/${JAR_PATH}/${MEMES_IN_CATEGORY_MR}${JAR_EXT}`;
        case MOST_COMMENTED_NEWS_MR:
            return `${env.PWD}/${JAR_PATH}/${MOST_COMMENTED_NEWS_MR}${JAR_EXT}`;
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
        const timestamp = Date.now();
        const outputDir = `${NAMESPACE}/${timestamp}`;

        return new Promise((resolve, reject) => {
            const chunks = [];
            ProcessManager.spawn(COMMAND, [JAR, MapReduceHandler.getJarByAction(action), MapReduceHandler.buildInputPath(domain), outputDir])
                .then((child) => {
                    console.log('MapReduce');
                    child.stderr.on(ERROR_MESSAGE, (code) => {
                        console.error(code);
                        reject(code);
                    });

                    child.stdout.on(DATA_MESSAGE, (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });

                    child.on(EXIT_MESSAGE, (code) => {
                        console.log(Buffer.concat(chunks).toString('utf8'));
                        console.log(`HDFS read process exited with code: ${code}`);
                        resolve(true);
                    });
                });
        }).then(() => timestamp);
    }
}

module.exports = {
    MapReduceHandler,
    MEMES_IN_CATEGORY_MR,
    MOST_COMMENTED_NEWS_MR,
    REDUCE_OUTPUT,
};
