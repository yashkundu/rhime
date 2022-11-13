import {JsMsg} from 'nats'
import {PostCreatedEvent} from '@rhime/events'

import { fanOutPost } from './fanOut'

import { ProfileFeed } from '../db/collections/profileFeedCollection'
import {ObjectId} from 'bson'

import { MongoServerError } from 'mongodb'


const postCreatedHandler = async (event: PostCreatedEvent, msg: JsMsg) => {
    try {
        await ProfileFeed.insertOne({
            _id: {
                userId: new ObjectId(event.userId),
                postId: new ObjectId(event.postId)
            }
        })
        await fanOutPost(event.userId, event.postId);
        msg.ack()
    } catch (error) {
        console.log(error);
        if(error instanceof MongoServerError && error.code===11000) {
            msg.ack();
        }
    }
}

export {postCreatedHandler}