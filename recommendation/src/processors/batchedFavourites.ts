import { DataType, ResultType, JobType } from "../interfaces/stWorker";
import {Job} from 'bullmq'
import { Token } from "../db/collections/tokenCollection";
import { BATCH_SIZE } from "../config";
import { BATCH_INTERVAL } from "../config";
import {fetchScheduledUserFavourites} from '../utils/scheduledUtils/favourites'
import { stTaskQueue } from "../stTaskQueue";

// in-memory state :) do something about it when the system restarts -- :(
import { state } from "../state";


export const batchedFavourites: (job: Job<DataType, ResultType, JobType>) => Promise<ResultType> = async (job) => {
    try {
        console.log('batching favourites ..........');
        const matchObj: {[key: string]: any} = {}
        if(state.favAnchorId) matchObj._id = {$gt: state.favAnchorId}

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
        if(users.length>0) state.favAnchorId = users[users.length-1]._id

        for(const user of users) {
            console.log(user);
            const userId = user._id as string
            await fetchScheduledUserFavourites(userId);
            // console.log('genreDict : ', dicts.genreDict);
            // console.log('artistDict : ', dicts.artistDict);
            // console.log('trackDict : ', dicts.trackDict);
        }

        state.cnt = state.cnt-1;

        if(state.cnt===0) {
            state.recAnchorId = null
            await stTaskQueue.queue.add('batchedRecommends', {}, 
                {
                    repeat: {
                        every: BATCH_INTERVAL,
                        limit: state.limit
                    }
                }
            )
        }

        return {success: true}
    } catch (error) {
        console.log(error)
        throw error
    }
}