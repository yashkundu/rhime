import {mongo} from '../mongo'
import { Collection, Document, ObjectId } from "mongodb";

export enum TokenFields{
    _id = '_id',
    access_token = 'access_token',
    refresh_token = 'refresh_token',
    expiration = 'expiration'
}

// somehow make it stateless
export interface token extends Document{
    _id: ObjectId;                          // userId
    access_token: string;
    refresh_token: string;
    expiration: Date
}

class TokenCollection {
    private _collection?: Collection<token>
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<token>('Token')
        }
        return this._collection
    }
}

declare global{
    interface ProxyConstructor{
        new<T ,P extends Document>(target: T, handler: ProxyHandler<any>): Collection<P>
    }
}


export const Token = new Proxy<TokenCollection, token>(new TokenCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})



