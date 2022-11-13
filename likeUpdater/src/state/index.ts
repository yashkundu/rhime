import {EVENT_BATCH_SIZE} from '../config'

class State {
    counter: number;
    constructor() {
        this.counter = EVENT_BATCH_SIZE;
    }
    reset() {
        this.counter = EVENT_BATCH_SIZE
    }
}

export const state = new State();