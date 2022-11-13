import { DataType, ResultType, JobType } from "../interfaces/stWorker";
import {Job} from 'bullmq'
import { Token } from "../db/collections/tokenCollection";
import { BATCH_SIZE } from "../config";
import { createScheduledUserRecommends } from "../utils/scheduledUtils/recommends";

// in-memory anchorId :) do something about when the system restarts --
import { state } from "../state";

// most heavywt task :(

export const batchedRecommends: (job: Job<DataType, ResultType, JobType>) => Promise<ResultType> = async (job) => {
    try {
        console.log('batching recommends..........');
    
        const matchObj: {[key: string]: any} = {}
        if(state.recAnchorId) matchObj._id = {$gt: state.recAnchorId}

        const cursor = Token.aggregate([
            {
                $match: matchObj
            },
            {
                $sort: {'_id': 1}
            },
            {
                $limit: BATCH_SIZE
            }
        ])
        const users = await cursor.toArray()
        if(users.length>0) state.recAnchorId = users[users.length-1]._id

        for(const user of users) {
            console.log('updating recommends ----- ', user);
            const userId = user._id as string
            // console.log('genreDict : ', dicts.genreDict);
            // console.log('artistDict : ', dicts.artistDict);
            // console.log('trackDict : ', dicts.trackDict);
            await createScheduledUserRecommends(userId)
        }

        return {success: true}
    } catch (error) {
        console.log(error)
        throw error
    }
}