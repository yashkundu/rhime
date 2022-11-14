import { Document, Collection } from "mongodb";
import {mongo} from '../mongo'
import {ObjectId} from 'bson'

export enum MessiahFields {
    minionId = 'minionId',
    messiahId = 'messiahId'
}

export interface messiah extends Document{
    minionId: ObjectId;               // (minionId, messiahId) will be the indexed field
    messiahId: ObjectId
}

class MessiahCollection {
    private _collection?: Collection<messiah>
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<messiah>('Messiah')
        }
        return this._collection
    }
}



export const Messiah = new Proxy<MessiahCollection, messiah>(new MessiahCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})
