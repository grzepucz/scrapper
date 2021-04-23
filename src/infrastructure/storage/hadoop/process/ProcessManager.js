const { cpus } = require('os');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const ProcessListener = require('./ProcessListener');

const CPUS_LIMIT = cpus().length - 1;
const EXIT_EVENT = 'exit';

const current = [];

class ProcessManager extends EventEmitter {
    static canSpawn() {
        return current.length < CPUS_LIMIT;
    }

    static pushAndWait(...args) {
        ProcessListener.addToHeap(...args);

        return new Promise((resolve) => {
            const popCallback = () => {
                const parameters = ProcessListener.popFromHeap();
                if (parameters) {
                    ProcessListener.removeListener(ProcessListener.getPopEvent(), popCallback);
                    resolve(parameters && ProcessManager.spawn(...parameters));
                }
            };

            ProcessListener.addListener(ProcessListener.getPopEvent(), popCallback);
        });
    }

    static spawn(...args) {
        const spawnProcess = (parameters) => {
            const child = spawn(...parameters);
            current.push(child.pid);

            child.on(EXIT_EVENT, () => {
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

module.exports = ProcessManager;
