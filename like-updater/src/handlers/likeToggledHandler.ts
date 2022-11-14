import { JsMsg } from "nats"
import { EventEmitter } from "events";
import { LikeToggledEvent } from "@rhime/events";
import { state } from "../state";

import {mongo} from '../db/mongo'
import { ds } from "../ds/redis";

import { EVENT_TTL } from "../config";

import { ItemLike } from "../db/collections/ItemLikeCollection";

import {ObjectId} from 'bson'

const natsEmitter = new EventEmitter()

const acknowledge = (msg: JsMsg) => {
    msg.ack()
    state.counter--;
    if(!state.counter) {
        state.reset();
        natsEmitter.emit('finished');
    }
}

const likeToggledHandler = async (event: LikeToggledEvent, msg: JsMsg) => {
    
    const eventId = event.eventId;

    const val = await ds.redis.get(`event:${eventId}`)
    if(val) {
        acknowledge(msg);
        return;
    }
    ds.redis.set(`event:${eventId}`, 1, 'EX', EVENT_TTL)

    
    const session = mongo.client.startSession();
    try {
        const itemId = new ObjectId(event.itemId)
        const userId = new ObjectId(event.userId)

        //remove this transaction .. very inefficient :(
        await session.withTransaction(async () => {
            const res = await ItemLike.deleteOne({
                _id: {itemId, userId}
            })
            if(!res.deletedCount) {
                await ItemLike.insertOne({
                    _id: {itemId, userId}
                })
            }
        })
    } catch (error) {
        throw error
    }
    finally {
        await session.endSession();
    }
    acknowledge(msg)
}

export {likeToggledHandler, natsEmitter, acknowledge}