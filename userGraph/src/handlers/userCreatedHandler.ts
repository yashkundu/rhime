import {JsMsg} from 'nats'
import {UserCreatedEvent} from '@rhime/events'

import {ObjectId, Int32} from 'bson'

import { ValidUser } from '../db/collections/validUserCollections'



const userCreatedHandler = async (event: UserCreatedEvent, msg: JsMsg) => {
    try {
        await ValidUser.insertOne({
            _id: new ObjectId(event.userId),
            minionCount: new Int32(0),
            messiahCount: new Int32(0)
        })
        msg.ack()
    } catch (error) {
        console.log('Error in handling the userCreatedEvent');
    }    
}

export {userCreatedHandler}