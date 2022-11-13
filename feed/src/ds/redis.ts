import {default as Redis, RedisOptions} from 'ioredis'

/*
user:ObjectId ->  A sorted set of k postIds

*/

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

    // it's important to use sorted set
    // 2 reasons
    // 1) to make the push into feed operation idiomatic so that event if multiple events are delivered it doesn't affect the functionality
    // 2) maybe multiple posts are pushed and it will be a havoc so, ordering is not strictly guaranteed so sorted set is necessary


    defineCommands(){
        this._redis.defineCommand('reduceToLimit', {
            numberOfKeys: 1,
            lua: `
                local rInd = -(ARGV[1]+1)
                local keys = redis.call("zrange", KEYS[1], 0, rInd)
                redis.call("zrem", KEYS[1], unpack(keys))
            `
        })    
    }
}

export const ds = new RedisWrapper()