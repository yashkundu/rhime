import { Document, Collection } from "mongodb";
import {mongo} from '../mongo'

import {ObjectId, Int32} from 'bson' 


export enum RTLikeCountFields{
    itemId = 'itemId',
    count = 'count'
}


export interface rTLikeCount extends Document{
    _id: ObjectId;                      // itemId
    count: Int32
}


class RTLikeCountCollection {
    private _collection!: Collection<rTLikeCount>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<rTLikeCount>('RTLikeCount')
        }
        return this._collection
    }
}

export const RTLikeCount = new Proxy<RTLikeCountCollection, rTLikeCount>(new RTLikeCountCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})