import {mongo} from '../mongo'
import { Collection, Document } from "mongodb";
import {ObjectId, Int32} from 'bson'

export enum ItemFields{
    _id = '_id',
    itemId = 'itemId',
    itemName = 'itemName',
    wt = 'wt',
    itemType = 'itemType'
}


export interface item extends Document{
    _id: {
        userId: ObjectId;               // userId
        itemId: string;
    }                          
    itemName?: string;
    wt: Int32;
    itemType: string     // 0-Track  1-Artist  2-genre   (_id.userId, itemType) -- index
}
// will store the favourite tracks of every user :)

class ItemCollection {
    private _collection?: Collection<item>
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<item>('Item')
        }
        return this._collection
    }
}


export const Item = new Proxy<ItemCollection, item>(new ItemCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})



