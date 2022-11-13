import { Document, Collection } from "mongodb";
import { ObjectId, Long } from "bson";
import {mongo} from '../mongo'

// postId should be strictly increasing with time
// (_id, postId) - index of collection

export enum ProfileFeedFields{
    _id = '_id',
    userId = 'userId',
    postId = 'postId',
}

export interface profileFeed extends Document{
    _id: {
        userId: ObjectId;
        postId: ObjectId
    }
}


class ProfileFeedCollection {
    private _collection!: Collection<profileFeed>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<profileFeed>('ProfileFeed')
        }
        return this._collection
    }
}


declare global{
    interface ProxyConstructor{
        new<T, P extends Document> (target: T, handler: ProxyHandler<any>): Collection<P>
    }
}

export const ProfileFeed = new Proxy<ProfileFeedCollection, profileFeed>(new ProfileFeedCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})