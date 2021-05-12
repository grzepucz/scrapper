const { cpus } = require('os');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const ProcessListener = require('./ProcessListener');

const CPUS_LIMIT = Math.floor(cpus().length * (2 / 3));

const DATA_MESSAGE = 'data';
const ERROR_MESSAGE = 'error';
const EXIT_MESSAGE = 'exit';

const current = [];

/**
 *
 */
class ProcessManager extends EventEmitter {
    /**
     *
     * @returns {boolean}
     */
    static canSpawn() {
        return current.length <= CPUS_LIMIT;
    }

    /**
     *
     * @param child
     */
    static debug(child) {
        const channels = [child, child.stderr, child.stdout];

        /**
         *
         * @param channel
         */
        const initListeners = (channel) => {
            const chunks = [];

            channel.on(ERROR_MESSAGE, (chunk) => {
                chunks.push(Buffer.from(chunk));
            });

            channel.on(DATA_MESSAGE, (chunk) => {
                chunks.push(Buffer.from(chunk));
            });

            channel.on(EXIT_MESSAGE, (code) => {
                if (code !== 0) {
                    console.error(`${child.pid} process exited with non zero code: ${code}`);
                }
                console.log(Buffer.concat(chunks).toString('utf8'));
            });
        };

        channels.forEach((channel) => initListeners(channel));
    }

    /**
     *
     * @param args
     * @returns {Promise<*>}
     */
    static pushAndWait(...args) {
        ProcessListener.addToHeap(...args);

        return new Promise((resolve) => {
            const popCallback = () => {
                const parameters = ProcessListener.popFromHeap();
                if (parameters) {
                    const child = ProcessManager.spawn(...parameters);
                    resolve(child);
                }

                ProcessListener.removeListener(ProcessListener.getPopEvent(), popCallback);
            };

            ProcessListener.addListener(ProcessListener.getPopEvent(), popCallback);
        }).then((child) => child);
    }

    /**
     *
     * @param args
     * @returns {Promise<*>}
     */
    static spawn(...args) {
        const spawnProcess = (parameters) => {
            const child = spawn(...parameters);
            current.push(child.pid);

            child.on(EXIT_MESSAGE, () => {
                current.pop();
                ProcessListener.emit(ProcessListener.getPopEvent());
            });

            return child;
        };

        return new Promise((resolve) => {
            if (ProcessManager.canSpawn()) {
                resolve(spawnProcess(args));
            } else {
                resolve(ProcessManager.pushAndWait(args));
            }
        }).then((child) => child);
    }
}

module.exports = {
    ProcessManager,
    DATA_MESSAGE,
    ERROR_MESSAGE,
    EXIT_MESSAGE,
};
