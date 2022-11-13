import { DataType, ResultType, JobType } from "../interfaces/ltWorker";
import {Job} from 'bullmq'
import {fetchInitialUserFavourites} from '../utils/initialUtils/favourites'
import { createInitialUserRecommends } from "../utils/initialUtils/recommends";


const initialFetch: (job: Job<DataType, ResultType, JobType>) => Promise<ResultType> = async (job) => {
    try {
        console.log('Initial Fetch ... ');
        const userId = job.data.userId as string
        console.log('userId : ', userId);
        
        const dicts = await fetchInitialUserFavourites(userId);
        console.log('Dicts Successful :)..........');
        await createInitialUserRecommends(userId, dicts.trackDict, dicts.artistDict, dicts.genreDict)
        console.log('Successful :)..........');
        return {success: true}
    } catch (error) {
        job.moveToFailed((error as Error), 'Initital fetch failure')
        console.log(error);
        throw error
    }
}

export {initialFetch}