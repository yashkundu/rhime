import {mongo} from '../mongo'
import {Collection, Document, ObjectId} from 'mongodb'

export enum UserFields{
    email = 'email',
    userName = 'userName',
    password = 'password',
    isAuth = 'isAuth'
}

export interface user extends Document{
    email: string;
    userName: string;
    password: string;
    isAuth: boolean
}

class UserCollection{
    private _collection!: Collection<user>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<user>('User')
        }
        return this._collection
    }
}

declare global{
    interface ProxyConstructor {
        new<T, P extends Document> (target: T, handler: ProxyHandler<any>) : Collection<P>
    }
}

export const User = new Proxy<UserCollection, user>(new UserCollection(), {
    get(target, prop){
        return target.collection[prop as keyof typeof target.collection]
    }
})