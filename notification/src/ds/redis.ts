import {default as Redis, RedisOptions} from 'ioredis'


class RedisWrapper{
    _redis!: Redis;
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