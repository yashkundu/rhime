import { PostCreatedEvent } from "@rhime/events"
import { JsMsg } from "nats"

import { ValidPost } from "../db/collections/validPostCollection"

import {ObjectId} from 'bson'

const postCreatedHandler = async (event: PostCreatedEvent, msg: JsMsg) => {
    try {
        await ValidPost.insertOne({_id: new ObjectId(event.postId)})
        msg.ack()
    } catch (error) {
        console.log(error);
    }
}

export {postCreatedHandler}