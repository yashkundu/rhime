import { CACHE_LIMIT } from '../config'
import { UserGraphView } from '../services/userGraphView'
import { ds } from '../ds/redis'
import { Minions } from '../interfaces/minionsInterface'


const fanOutPost = async (ownerId: string, postId: string) => {
    const call = UserGraphView.service.getMinions({userId: ownerId})

    let promises = []

    const ownerKey = `userFeed:${ownerId}`
    promises.push(
        ds.redis.pipeline()
        .zadd(ownerKey, 0, postId)
        //@ts-ignore
        .reduceToLimit(ownerKey, CACHE_LIMIT)
        .exec() 
    );

    

    let minions: Minions;
    while(minions=call.read()){
        const pipeline = ds.redis.pipeline()
        minions.userIds.forEach(async (id:Buffer) => {
            const userKey = `userFeed:${id.toString('hex')}`
            pipeline.zadd(userKey, 0,  postId)
            // @ts-ignore
            pipeline.reduceToLimit(userKey, CACHE_LIMIT)
        })
        promises.push(pipeline.exec())
    }

    await Promise.all(promises)
}



export {fanOutPost}