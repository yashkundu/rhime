import {axios} from '../../axios'
import _ from 'lodash'

type ItemName = 'tracks' | 'artists';
type TimeType = 'medium_term' | 'short_term'

import { AxiosError } from 'axios';



// calculates all the favoured tracks, artists and genres
// along with their respective weights :)
export const calculateUserFavourites = async (userId: string, timeRange: TimeType) => {
    const tracks = await fetchItems(userId, 'tracks', timeRange)

    const trackDict: {[key: string]: {trackName: string, artists: {artistId: string, artistName: string}[], wt: number}} = {}

    tracks.forEach(track => {
        trackDict[track.id] = {
            trackName: track.name,
            artists: track.artists.map((artist: any) => ({
                artistId: artist.id,
                artistName: artist.name
            })),
            wt: 3
        }
    })

    const artists = await fetchItems(userId, 'artists', timeRange)

    const artistDict: {[key: string]: {artistName: string, genres?: string[], wt: number}} = {}

    artists.forEach(artist => {
        artistDict[artist.id] = {
            artistName: artist.name,
            genres: artist.genres,
            wt: 8
        }
    })

    for(const [trackId, track] of Object.entries(trackDict)) {
        for(const artist of track.artists){
            if(!artistDict[artist.artistId]) {
                artistDict[artist.artistId] = {
                    ...artist,
                    wt: 0
                }
            } 
            artistDict[artist.artistId].wt += track.wt
        }
    }

    await sanitizeArtists(artistDict, userId)

    const genreDict: {[key: string]: {wt: number}} = {}

    for(const [artistId, artist] of Object.entries(artistDict)) {
        for(const genre of artist.genres!) {
            if(!genreDict[genre]) genreDict[genre] = {wt: 0}
            genreDict[genre].wt += artist.wt
        }
    }

    return {trackDict, artistDict, genreDict}
    
}


const sanitizeArtists = async (artistDict: {[key: string]: {artistName: string, genres?: string[], wt: number}}, userId: string) => {
    const artistIds: string[] = []
    for(const [artistId, artist] of Object.entries(artistDict)) {
        if(!artist.genres)  artistIds.push(artistId)
    }

    const chunks = _.chunk(artistIds, 30)

    for(const arr of chunks) {
        const res = await axios.get('/artists?ids=' + arr.join(), {
            headers: {
                'Authorization': userId
            }
        })
        res.data.artists.forEach((artist: any) => {
            artistDict[artist.id].genres = artist.genres
        })
    }

}



const fetchItems = async (userId: string, item: ItemName, timeRange: TimeType) => {
    const items: any[] = []
    try{
        let next: string = `/me/top/${item}?time_range=${timeRange}&limit=50&offset=0`
        while(next){
            const res = await axios.get(next, {
                headers: {
                    'Authorization': userId
                }
            })
            res.data.items.forEach((item: any) => {
                items.push(item)
            });
            next = res.data.next
        }

    } catch(error) {
        console.log('Axios Error : ', error);
        
        // console.log((error as AxiosError).code);
        
    }
    return items;
}