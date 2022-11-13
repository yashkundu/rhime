import { mongo } from '../mongo';
import {Document, Collection} from 'mongodb'
import { ObjectId, Int32 } from 'bson';


export enum UserProfileFields{
    userName = 'userName',
    email = 'email',
    firstName = 'firstName',
    lastName = 'lastName',
    bio = 'bio',
    age = 'age',
    gender = 'gender',
    profileImage = 'profileImage',
}

type genders = 'male' | 'female'

export interface userProfile extends Document{
    _id: ObjectId;                                  // userId
    userName: string;
    email: string;
    firstName: string;
    lastName?: string;
    bio?: string;
    age?: Int32;
    gender?: genders;
    profileImage?: string;
} 


class UserProfileCollection {
    private _collection!: Collection<userProfile> 
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<userProfile>('UserProfile')
        }
        return this._collection
    }
}

declare global{
    interface ProxyConstructor{
        new<T,P extends Document>(target: T, handler: ProxyHandler<any>): Collection<P>
    }
}


export const UserProfile = new Proxy<UserProfileCollection, userProfile>(new UserProfileCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})
