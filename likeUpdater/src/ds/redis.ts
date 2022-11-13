import {default as Redis, RedisOptions} from 'ioredis'

// This will mainly be used to prevent duplicate events from being handledin likeUpdater
// Any incoming event Id will be stored in the memory for some time so that if that
// event comes again we don't process that again

// Here i can also limit the like capacity of a user for a particular post
// That will be cool

// Maybe limit set a limit for some seconds and also prevent the duplication

class RedisWrapper{
    private _redis!: Redis;
    get redis(){
        if(!this._redis){
            throw new Error('Redis instance is not connected')
        }
        return this._redis
    }
    connect(opts: RedisOptions){
        return new Promise<void>((resolve, reject) => {
            this._redis = new Redis(opts)
            this._redis.on('connect', () => {
                resolve()
            })
            this._redis.on('error', (e) => {
                reject(e)
            })
        })
    }

}

export const ds = new RedisWrapper()