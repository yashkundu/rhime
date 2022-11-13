import {Worker, Job} from 'bullmq'
import {default as Redis, RedisOptions} from 'ioredis'

import { DataType, ResultType, JobType } from '../interfaces/stWorker'


class StTaskWorker {
    private _worker!: Worker<DataType, ResultType, JobType>;
    manager: {[key in JobType]? : (job: Job<DataType, ResultType, JobType>) => Promise<ResultType>} = {};
    private _redis!: Redis;

    get worker() {
        if(!this._worker) {
            throw new Error('stTaskWorker not connected to Redis')
        }
        return this._worker
    }

    get redis(){
        if(!this._redis) throw new Error('stTaskWorker\'s Redis instance is not connected')
        return this._redis;
    }

    async start(opts: RedisOptions) {
        return new Promise<void>((resolve, reject) => {
            const redis = new Redis(opts)
            redis.on('connect', () => {
                this._redis = redis
                this._worker = new Worker<DataType, ResultType, JobType>(
                    'stQueue', 
                    async (job: Job<DataType, ResultType, JobType>) => {
                        let lastObj: ResultType;
                        try{
                            const processor = this.manager[job.name]
                            if(processor){
                                lastObj = await processor(job)
                            }
                            else throw new Error('No processor found for the job')
                        } catch{
                            throw new Error('Job not successfull')
                        }
                        return lastObj!
                    }, 
                    { connection: redis })

                resolve()
            })
            redis.on('error', (e) => {
                reject(e);
            })
        })
    }
}


export const stTaskWorker = new StTaskWorker()