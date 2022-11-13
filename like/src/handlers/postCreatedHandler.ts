import {JsMsg} from 'nats'
import {PostCreatedEvent} from '@rhime/events'

import { insertValidItem } from '../utils'

import { MongoServerError } from 'mongodb'

import {ObjectId} from 'bson'

const postCreatedHandler = async (event: PostCreatedEvent, msg: JsMsg) => {
    try {
        await insertValidItem(new ObjectId(event.postId))
        msg.ack()
    } catch (error) {
        console.log(error);
        if(error instanceof MongoServerError && error.code===11000) {
            msg.ack();
        }
    }
}

export {postCreatedHandler}