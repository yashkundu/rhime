import {JsMsg} from 'nats'
import {UserCreatedEvent} from '@rhime/events'

import {ObjectId} from 'bson'

import { UserProfile } from '../db/collections/userProfileCollection'
import pokemon from 'pokemon'


const userCreatedHandler = async (event: UserCreatedEvent, msg: JsMsg) => {
    try {
        await UserProfile.insertOne({
            _id: new ObjectId(event.userId),
            firstName: pokemon.random(),
            userName: event.userName,
            email: event.email
        })
        msg.ack()
    } catch (error) {
        console.log('Error in handling the userCreatedEvent');
    }    
}

export {userCreatedHandler}