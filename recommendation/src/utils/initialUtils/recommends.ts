import { Recommend } from "../../db/collections/recommendCollection"
import { Item } from "../../db/collections/itemCollection"
import {ObjectId, Double} from 'bson'


export const createInitialUserRecommends = async (
    userId: string, 
    trackDict: {[key: string]: {trackName: string, artists: {artistId: string, artistName: string}[], wt: number}},
    artistDict: {[key: string]: {artistName: string, genres?: string[], wt: number}},
    genreDict: {[key: string]: {wt: number}}) =>{
    const userObjId = new ObjectId(userId)
    await calculateInitialRecommends(userObjId, trackDict, artistDict, genreDict)
}


const calculateInitialRecommends = async (
    userId: ObjectId, 
    trackDict: {[key: string]: {trackName: string, artists: {artistId: string, artistName: string}[], wt: number}},
    artistDict: {[key: string]: {artistName: string, genres?: string[], wt: number}},
    genreDict: {[key: string]: {wt: number}}) => {
    
    let sum0 = 0, sum1 = 0, sum2 = 0;
    for(const [trackId, track] of Object.entries(trackDict)) sum0 += track.wt;
    for(const [artistId, artist] of Object.entries(artistDict)) sum1 += artist.wt;
    for(const [genreName, genre] of Object.entries(genreDict)) sum2 += genre.wt;
    
    const cursor = Item.aggregate([
        {
            $match: {'_id.userId': {$ne: userId}}
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

        // WEIGHTED JACCARD INDEX

        const s0 = min0/(sum0 + total0 - min0)
        const s1 = min1/(sum1 + total1 - min1)
        const s2 = min2/(sum2 + total2 - min2)
        const similarity = (4*s0 + 3*s1 + 3*s2)/10

        await addInitialRecommend(userId, user!._id, similarity)
        await addInitialRecommend(user!._id, userId, similarity)
        
    }
}

const addInitialRecommend = async (userId1: ObjectId, userId2: ObjectId, similarity: number) => {
    await Recommend.insertOne({
        _id: {
            userId1: userId1,
            userId2: userId2
        },
        similarity: new Double(similarity),
        isValid: true
    })
}