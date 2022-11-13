import _ from 'lodash'
import {mongo} from '../../db/mongo'
import { ObjectId, Int32 } from "bson";
import { item } from '../../db/collections/itemCollection';
import {ClientSession} from 'mongodb'
import {calculateUserFavourites} from '../commonUtils/favourites'



export const fetchInitialUserFavourites = async (userId: string) => {

    const {trackDict, artistDict, genreDict} = await calculateUserFavourites(userId, 'medium_term');
    
    // persisting tracks, artists and genres with thier respective weights
    // in the databse :) -----------------------------------------------------
    const session = mongo.client.startSession()
    try {
        await session.withTransaction(async () => {
            await persistInitialTracks(userId, session, trackDict)
            await persistInitialArtists(userId, session, artistDict)
            await persistInitialGenres(userId, session, genreDict)
        })
    } catch (error) {
        console.log(error);
        throw error
    }
    finally {
        await session.endSession();
    }
    return {trackDict, artistDict, genreDict}
}



const persistInitialTracks = async (userId: string, session: ClientSession, trackDict: {[key: string]: {trackName: string, artists: {artistId: string, artistName: string}[], wt: number}}) => {
    const trackDocs: item[] = []
    for(const [trackId, track] of Object.entries(trackDict)) {
        trackDocs.push({
            _id: {
                userId: new ObjectId(userId),
                itemId: trackId
            },
            itemName: track.trackName,
            wt: new Int32(track.wt),
            itemType: '0'
        })
    }
    return (trackDocs.length>0) 
    ? mongo.db.collection<item>('Item').insertMany(trackDocs, {session})
    : Promise<void>;
}   

const persistInitialArtists = async (userId:string, session: ClientSession, artistDict: {[key: string]: {artistName: string, genres?: string[], wt: number}}) => {
    const artistDocs: item[] = []
    for(const [artistId, artist] of Object.entries(artistDict)) {
        artistDocs.push({
            _id: {
                userId: new ObjectId(userId),
                itemId: artistId
            },
            itemName: artist.artistName,
            wt: new Int32(artist.wt),
            itemType: '1'
        })
    }
    return (artistDocs.length>0) 
    ? mongo.db.collection<item>('Item').insertMany(artistDocs, {session})
    : Promise<void>;
}

const persistInitialGenres = async (userId: string, session: ClientSession, genreDict: {[key: string]: {wt: number}}) => {
    const genreDocs: item[] = []
    for(const [genreName, genre] of Object.entries(genreDict)) {
        genreDocs.push({
            _id: {
                userId: new ObjectId(userId),
                itemId: genreName
            },
            wt: new Int32(genre.wt),
            itemType: '2'
        })
    }
    return (genreDocs.length>0) 
    ? mongo.db.collection<item>('Item').insertMany(genreDocs, {session})
    : Promise<void>;
}