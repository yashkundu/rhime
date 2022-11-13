import { JsMsg } from "nats"
import { EventEmitter } from "events";
import { LikeToggledEvent } from "@rhime/events";
import { state } from "../state";

const natsEmitter = new EventEmitter()

const acknowledge = (msg: JsMsg) => {
    msg.ack()
    state.counter--;
    if(!state.counter) {
        state.resetCounter();
        natsEmitter.emit('finished');
    }
}

const likeToggledHandler = async (event: LikeToggledEvent, msg: JsMsg) => {
    state.updateLike(event.itemId, event.type);
    acknowledge(msg)
}

export {likeToggledHandler, natsEmitter, acknowledge}