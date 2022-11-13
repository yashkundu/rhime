import { Recommend } from "../../db/collections/recommendCollection"
import { Item } from "../../db/collections/itemCollection"
import {ObjectId, Double} from 'bson'
import { mongo } from "../../db/mongo"


export const createScheduledUserRecommends = async (userId: string) =>{
    const userObjId = new ObjectId(userId)
    const {trackDict, artistDict, genreDict} = await createFavouriteDicts(userObjId)
    console.log(Object.keys(trackDict).length, Object.keys(artistDict).length, Object.keys(genreDict).length);
    
    await calculateScheduledRecommends(userObjId, trackDict, artistDict, genreDict)
}

const createFavouriteDicts = async (userId: ObjectId) => {
    const trackDict: {[key: string]: {wt: number}} = {};
    const artistDict: {[key: string]: {wt: number}} = {};
    const genreDict: {[key: string]: {wt: number}} = {};

    const cursor = Item.find({'_id.userId': userId})

    while(await cursor.hasNext()) {
        const doc = await cursor.next()
        switch(doc?.itemType){
            case '0':
                trackDict[doc._id.itemId] = {
                    wt: Number(doc.wt.toString())
                }
                break;
            case '1':
                artistDict[doc._id.itemId] = {
                    wt: Number(doc.wt.toString())
                }
                break;
            case '2':
                genreDict[doc._id.itemId] = {
                    wt: Number(doc.wt.toString())
                }
        }
    }
    return {trackDict, artistDict, genreDict}
}


const calculateScheduledRecommends = async (
    userId: ObjectId, 
    trackDict: {[key: string]: {wt: number}},
    artistDict: {[key: string]: {wt: number}},
    genreDict: {[key: string]: {wt: number}}) => {
    
    let sum0 = 0, sum1 = 0, sum2 = 0;
    for(const [trackId, track] of Object.entries(trackDict)) sum0 += track.wt;
    for(const [artistId, artist] of Object.entries(artistDict)) sum1 += artist.wt;
    for(const [genreName, genre] of Object.entries(genreDict)) sum2 += genre.wt;

    
    
    
    const cursor = Item.aggregate([
        {
            $match: {'_id.userId': {$gt: userId}}
        }, 
        {
            $group: {
                _id: '$_id.userId',
                itemWts: {$push: {itemId: '$_id.itemId', wt: '$wt', itemType: '$itemType'}}
            }
        }
    ])

    console.log(`[sum0, sum1, sum2] - [${sum0}, ${sum1}, ${sum2}]`);

    while(await cursor.hasNext()){
        const user = await cursor.next()
        let min0 = 0, min1 = 0, min2 = 0;
        let total0 = 0, total1 = 0, total2 = 0;

        user!.itemWts.forEach((item: any) => {
            switch(item.itemType){
                case '0':
                    total0 += item.wt;
                    min0 += (trackDict[item.itemId]?Math.min(trackDict[item.itemId].wt, item.wt):0);
                    break;
                case '1':
                    total1 += item.wt;
                    min1 += (artistDict[item.itemId]?Math.min(artistDict[item.itemId].wt, item.wt):0);
                    break;
                case '2':
                    total2 += item.wt;
                    min2 += (genreDict[item.itemId]?Math.min(genreDict[item.itemId].wt, item.wt):0);
                    break;
            }
        })

        console.log(`[total0, total1, total2] - [${total0}, ${total1}, ${total2}]`);
        console.log(`[min0, min1, min2] - [${min0}, ${min1}, ${min2}]`);

        const s0 = min0/(sum0 + total0 - min0)
        const s1 = min1/(sum1 + total1 - min1)
        const s2 = min2/(sum2 + total2 - min2)
        const similarity = (4*s0 + 3*s1 + 3*s2)/10

        console.log(`[s0, s1, s2] - [${s0}, ${s1}, ${s2}]`);

        await addScheduledRecommend(userId, user!._id, similarity)
        await addScheduledRecommend(user!._id, userId, similarity)
        
    }
}

const addScheduledRecommend = async (userId1: ObjectId, userId2: ObjectId, similarity: number) => {
        try{
            await Recommend.updateOne({'_id.userId1': userId1, '_id.userId2': userId2},
                { 
                    $set: {similarity: new Double(similarity)},
                    $setOnInsert: {isValid: true}
                },
                { upsert: true}
            )
        } catch(e) {
            console.log(e)
        } 
}