import { Document, Collection } from "mongodb";
import {mongo} from '../mongo'
import {ObjectId, Int32} from 'bson'


// Two separate collections because of sharding

export enum ValidUserFields {
    minionCount = 'minionCount',
    messiahCount = 'messiahCount'
}

export interface validUser extends Document{
    _id: ObjectId,                              // userId
    minionCount: Int32,
    messiahCount: Int32
}

class ValidUserCollection {
    private _collection?: Collection<validUser>
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<validUser>('ValidUser')
        }
        return this._collection
    }
}


export const ValidUser = new Proxy<ValidUserCollection, validUser>(new ValidUserCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})
