import {JsMsg} from 'nats'
import {CommentCreatedEvent} from '@rhime/events'

import { insertValidItem } from '../utils'

import { MongoServerError } from 'mongodb'

import {ObjectId} from 'bson'

const commentCreatedHandler = async (event: CommentCreatedEvent, msg: JsMsg) => {
    try {
        await insertValidItem(new ObjectId(event.commentId))
        msg.ack()
    } catch (error) {
        console.log(error);
        if(error instanceof MongoServerError && error.code===11000) {
            msg.ack();
        }
    }
}

export {commentCreatedHandler}