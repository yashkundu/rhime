import { DataType, ResultType, JobType } from "../interfaces/ltWorker";
import {Job} from 'bullmq'
import { stTaskQueue } from "../stTaskQueue";
import { Token } from "../db/collections/tokenCollection";
import { BATCH_SIZE } from "../config";
import { BATCH_INTERVAL } from "../config";

import { state } from "../state";


const scheduledFetch: (job: Job<DataType, ResultType, JobType>) => Promise<ResultType> = async (job) => {
    try{
        console.log('scheduled ......... ');
    
        const count = await Token.countDocuments({})
        const lim = Math.ceil(count/BATCH_SIZE)

        state.favAnchorId = null;
        state.cnt = lim;
        state.limit = lim
        
        await stTaskQueue.queue.add('batchedFavourites', {}, 
        {
            repeat: {
                every: BATCH_INTERVAL,
                limit: state.limit
            }
        })

        return {success: true}
    } catch(error) {
        console.log(error)
        throw error
    }
}

export {scheduledFetch}