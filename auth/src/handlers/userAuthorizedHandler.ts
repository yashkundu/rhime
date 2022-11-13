import { UserAuthorizedEvent } from "@rhime/events"
import { JsMsg } from "nats"

import {ObjectId} from 'bson'

import { User } from "../db/collections/userCollection"

const userAuthorizedHandler = async (event: UserAuthorizedEvent, msg: JsMsg) => {
    try {
        const userId = new ObjectId(event.userId)
        await User.updateOne({_id: userId}, {
            $set: {isAuth: true}
        })
        console.log('Updated user"s isAuth');
        
        msg.ack()
    } catch (error) {
        console.log(error);
    }
}

export {userAuthorizedHandler}