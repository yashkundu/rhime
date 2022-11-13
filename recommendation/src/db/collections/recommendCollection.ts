import {mongo} from '../mongo'
import { Collection, Document } from "mongodb";
import {ObjectId, Double} from 'bson'

export enum RecommendFields{
    _id = '_id',
    artistId = 'artistId',
    userId1 = 'userId1',
    userId2 = 'userId2'
}


export interface recommend extends Document{
    _id: {
        userId1: ObjectId;           // userId
        userId2: ObjectId            // (_id.userId1, similarity)  -- index
    }                          
    isValid: boolean;
    similarity: Double
}
// will store the favourite artists of every user :)

class RecommendCollection {
    private _collection?: Collection<recommend>
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<recommend>('Recommend')
        }
        return this._collection
    }
}



export const Recommend = new Proxy<RecommendCollection, recommend>(new RecommendCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})



