import {default as Redis, RedisOptions} from 'ioredis'
import {Queue} from 'bullmq'
import {JobType, DataType, ResultType} from '../interfaces/queue'

import {COMPLETED_JOBS_LOG} from '../config'

class LTTaskQueue {
    _queue!: Queue<DataType, ResultType, JobType>;

    get queue() {
        if(!this._queue) {
            throw new Error('Redis instance is not connected')
        }
        return this._queue
    }

    async connect(opts: RedisOptions) {
        return new Promise<void>((resolve, reject) => {
            const redis = new Redis(opts)
            redis.on('connect', () => {
                this._queue = new Queue<DataType, ResultType, JobType>('ltQueue', {
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

export const ltTaskQueue = new LTTaskQueue()