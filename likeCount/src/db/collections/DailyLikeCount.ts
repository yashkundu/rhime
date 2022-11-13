import { Document, Collection } from "mongodb";
import {mongo} from '../mongo'

import {ObjectId, Int32} from 'bson' 


export enum DailyLikeCountFields{
    itemId = 'itemId',
    count = 'count'
}


export interface dailyLikeCount extends Document{
    _id: ObjectId;                      // itemId
    count: Int32
}


class DailyLikeCountCollection {
    private _collection!: Collection<dailyLikeCount>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<dailyLikeCount>('DailyLikeCount')
        }
        return this._collection
    }
}


declare global{
    interface ProxyConstructor{
        new<T, P extends Document> (target: T, handler: ProxyHandler<any>): Collection<P>
    }
}

export const DailyLikeCount = new Proxy<DailyLikeCountCollection, dailyLikeCount>(new DailyLikeCountCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})