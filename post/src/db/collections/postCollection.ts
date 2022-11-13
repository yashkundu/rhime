import { Document, Collection } from "mongodb";
import { ObjectId } from "bson";
import {mongo} from '../mongo'


export enum PostFields{
    userId = 'userId',
    caption = 'caption',
    trackId = 'trackId'
}

export interface post extends Document{
    userId: ObjectId,
    caption?: string,
    trackId: string
}


class PostCollection {
    private _collection!: Collection<post>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<post>('Post')
        }
        return this._collection
    }
}


declare global{
    interface ProxyConstructor{
        new<T, P extends Document> (target: T, handler: ProxyHandler<any>): Collection<P>
    }
}

export const Post = new Proxy<PostCollection, post>(new PostCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})