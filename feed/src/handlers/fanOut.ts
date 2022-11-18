import { CACHE_LIMIT } from '../config'
import { UserGraphView } from '../services/userGraphView'
import { ds } from '../ds/redis'


const fanOutPost = async (ownerId: string, postId: string) => {
    const call = UserGraphView.getMinions({userId: ownerId})

    let promises = []

    const ownerKey = `userFeed:${ownerId}`
    promises.push(
        ds.redis.pipeline()
        .zadd(ownerKey, 0, postId)
        //@ts-ignore
        .reduceToLimit(ownerKey, CACHE_LIMIT)
        .exec() 
    );

    call.on('error', function(err: Error) {
        console.log('Error in getting minions :(');
        console.log(err);
        throw err
    })

    

    for await (const minions of call){
        const pipeline = ds.redis.pipeline()
        minions.userIds.forEach(async (id:Buffer) => {
            const userKey = `userFeed:${id.toString('hex')}`
            pipeline.zadd(userKey, 0,  postId)
            // @ts-ignore
            pipeline.reduceToLimit(userKey, CACHE_LIMIT)
        })
        promises.push(pipeline.exec())
        console.log('minions -> ');
        console.log(JSON.stringify(minions))
    }

    await Promise.all(promises)
}



export {fanOutPost}