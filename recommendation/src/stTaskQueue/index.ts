import {Queue} from 'bullmq'
import {default as Redis, RedisOptions} from 'ioredis'
import {JobType, DataType, ResultType} from '../interfaces/stQueue'

import {COMPLETED_JOBS_LOG} from '../config'


class StTaskQueue {
    private _queue!: Queue<DataType, ResultType, JobType>;
    private _redis!: Redis

    get queue(){
        if(!this._queue) throw new Error('stTaskQueue not connected to Redis')
        return this._queue
    }

    get redis(){
        if(!this._redis) throw new Error('stTaskQueue\'s Redis instance not connected')
        return this._redis
    }

    async connect(opts: RedisOptions){
        return new Promise<void>((resolve, reject) => {
            const redis = new Redis(opts)
            redis.on('connect', () => {
                this._redis = redis
                this._queue = new Queue<DataType, ResultType, JobType>('stQueue', {
                    connection: redis,
                    defaultJobOptions: {
                        removeOnComplete: COMPLETED_JOBS_LOG
                    }
                })
                resolve()
            })
            redis.on('error', (e) => {
                reject(e)
            })
        })
    }
}

export const stTaskQueue = new StTaskQueue()