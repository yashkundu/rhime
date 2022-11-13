import { Document, Collection } from "mongodb";
import {mongo} from '../mongo'

import {ObjectId} from 'bson'


export enum ValidItemFields{
    
}

export interface validItem extends Document{
    _id: ObjectId;            // itemId
}


class ValidItemCollection {
    private _collection!: Collection<validItem>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<validItem>('ValidItem')
        }
        return this._collection
    }
}


export const ValidItem = new Proxy<ValidItemCollection, validItem>(new ValidItemCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})