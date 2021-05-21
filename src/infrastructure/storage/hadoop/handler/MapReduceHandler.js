const { env } = require('process');
const Raven = require('raven');
const {
    ProcessManager,
    ERROR_MESSAGE,
    DATA_MESSAGE,
    EXIT_MESSAGE,
} = require('../process/ProcessManager');
const Handler = require('./Handler');
const InvalidActionError = require('../error/InvalidActionError');

const JAR = 'jar';
const JAR_EXT = '.jar';
const JAR_PATH = 'bin';
const COMMAND = env.YARN_BIN || 'yarn';
const NAMESPACE = env.HDFS_NAMESPACE || '/scrapper';

const MEMES_IN_CATEGORY_MR = 'MemesInCategory';
const MOST_COMMENTED_NEWS_MR = 'MostCommentedNews';
const UFCLeaders = 'UFCLeaders';

const AVAILABLE_FILTERS = [
    MEMES_IN_CATEGORY_MR,
    MOST_COMMENTED_NEWS_MR,
    UFCLeaders,
];

/**
 *
 */
class MapReduceHandler extends Handler {
    /**
     *
     * @param domain
     * @returns {string}
     */
    static buildInputPath(domain) {
        return `${NAMESPACE}${domain ? `/${domain}` : ''}`;
    }

    /**
     *
     * @param action
     * @returns {string}
     */
    static getJarByAction(action) {
        if (!AVAILABLE_FILTERS.includes(action)) {
            throw new InvalidActionError();
        }

        return `${env.PWD}/${JAR_PATH}/${action}${JAR_EXT}`;
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
            ProcessManager.spawn(
                COMMAND,
                [JAR, MapReduceHandler.getJarByAction(action), MapReduceHandler.buildInputPath(domain), outputDir],
            )
                .then((child) => {
                    ProcessManager.debug(child);
                    console.log(`Spawned reducing ${timestamp}`);
                    const startTime = Date.now();
                    child.stderr.on(ERROR_MESSAGE, (code) => {
                        console.error(code);
                        reject(code);
                    });

                    child.stdout.on(DATA_MESSAGE, (chunk) => {
                        chunks.push(Buffer.from(chunk));
                    });

                    child.on(EXIT_MESSAGE, (code) => {
                        console.log(Buffer.concat(chunks).toString('utf8'));
                        console.log(`HDFS Map reduce process exited with code: ${code}.`);
                        console.log(`Took: ${(Date.now() - startTime) / 1000}s`);
                        resolve(true);
                    });
                });
        }).then(() => timestamp)
            .catch((error) => Raven.captureException(error));
    }
}

module.exports = MapReduceHandler;
