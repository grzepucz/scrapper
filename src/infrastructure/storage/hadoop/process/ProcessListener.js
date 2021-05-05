const { EventEmitter } = require('events');

const POP_EVENT = 'pop';
const LISTENERS_LIMIT = 40;

class ProcessListener extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(LISTENERS_LIMIT);
        this.heap = [];
    }

    addToHeap(...args) {
        this.heap.push(...args);
    }

    popFromHeap() {
        return this.heap.pop();
    }

    getPopEvent() {
        return POP_EVENT;
    }

    getHeap() {
        return this.heap;
    }
}

module.exports = new ProcessListener();
