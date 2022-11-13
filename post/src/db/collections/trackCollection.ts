import { Document, Collection } from "mongodb";
import { ObjectId } from "bson";
import {mongo} from '../mongo'


export enum TrackFields{
    trackName = 'trackName',
    listenUrl = 'listenUrl',
    artist = 'artists',
    artistName = 'artistName',
    artistId = 'artistId',
    images = 'images',
}

export interface track extends Document{
    _id: string,                    // trackId
    trackName: string,
    artists: {
        artistName: string;
        artistId: string
    }[],
    listenUrl?: string,
    images?: string[]
}


class TrackCollection {
    private _collection!: Collection<track>;
    get collection(){
        if(!this._collection){
            this._collection = mongo.db.collection<track>('Track')
        }
        return this._collection
    }
}



export const Track = new Proxy<TrackCollection, track>(new TrackCollection(), {
    get(target, prop){
        return target.collection[prop]
    }
})