const { EventEmitter } = require('events');

const POP_EVENT = 'pop';
const LISTENERS_LIMIT = 40;

/**
 *
 */
class ProcessListener extends EventEmitter {
    /**
     *
     */
    constructor() {
        super();
        this.setMaxListeners(LISTENERS_LIMIT);
        this.heap = [];
    }

    /**
     *
     * @param args
     */
    addToHeap(...args) {
        this.heap.push(...args);
    }

    /**
     *
     * @returns {*}
     */
    popFromHeap() {
        return this.heap.pop();
    }

    /**
     *
     * @returns {string}
     */
    getPopEvent() {
        return POP_EVENT;
    }

    /**
     *
     * @returns {[]}
     */
    getHeap() {
        return this.heap;
    }
}

module.exports = new ProcessListener();
