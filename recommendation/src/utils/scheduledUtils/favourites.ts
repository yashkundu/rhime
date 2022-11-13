import _ from 'lodash'
import {mongo} from '../../db/mongo'
import { ObjectId, Int32 } from "bson";
import { Item } from '../../db/collections/itemCollection';
import {ClientSession} from 'mongodb'
import {calculateUserFavourites} from '../commonUtils/favourites'


export const fetchScheduledUserFavourites = async (userId: string) => {
    const {trackDict, artistDict, genreDict} = await calculateUserFavourites(userId, 'short_term');
    
    // not caring about the liked songs in the subsequent updates --huge performance boost
    // just upsert all the items :)
    const session = mongo.client.startSession()
    try {
        await session.withTransaction(async () => {
            await persistScheduledTracks(userId, session, trackDict)
            await persistScheduledArtists(userId, session, artistDict)
            await persistScheduledGenres(userId, session, genreDict)
        })
    } catch (error) {
        throw error
    } finally {
        session.endSession()
    }
    return;
}

const persistScheduledTracks = async (userId: string, session: ClientSession, trackDict: {[key: string]: {trackName: string, artists: {artistId: string, artistName: string}[], wt: number}}) => {
    const promises: Promise<any>[] = []
    for(const [trackId, track] of Object.entries(trackDict)) {
        promises.push(Item.updateOne({
            _id: {
                userId: new ObjectId(userId),
                itemId: trackId
            }
        },
        {
            $set: {
                itemName: track.trackName,
                wt: new Int32(track.wt),
                itemType: '0'
            }
            
        }, {upsert: true, session: session}));
    }
    return Promise.all(promises)
}   

const persistScheduledArtists = async (userId:string, session: ClientSession, artistDict: {[key: string]: {artistName: string, genres?: string[], wt: number}}) => {
    const promises: Promise<any>[] = []
    for(const [artistId, artist] of Object.entries(artistDict)) {
        promises.push(Item.updateOne({
            _id: {
                userId: new ObjectId(userId),
                itemId: artistId
            }
        },
        {
            $set: {
                itemName: artist.artistName,
                wt: new Int32(artist.wt),
                itemType: '1'
            }
        }, {upsert: true, session: session}))
    };
    return Promise.all(promises)
}

const persistScheduledGenres = async (userId: string, session: ClientSession, genreDict: {[key: string]: {wt: number}}) => {
    const promises: Promise<any>[] = []
    for(const [genreName, genre] of Object.entries(genreDict)) {
        promises.push(Item.updateOne({
            _id: {
                userId: new ObjectId(userId),
                itemId: genreName
            }
        },
        {
            $set: {
                wt: new Int32(genre.wt),
                itemType: '2'
            }
            
        }, {upsert: true, session: session}))
    }
    return Promise.all(promises)
}
