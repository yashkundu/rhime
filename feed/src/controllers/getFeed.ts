import {Request, Response, NextFunction} from 'express'
import {ObjectId} from 'bson'
import { PAGE_SIZE } from '../config'
import { StatusCodes } from 'http-status-codes'
import { getTimelinePosts } from '../utils'
import {ds} from '../ds/redis'

import { CACHE_LIMIT } from '../config'


// A user rarely follows or unfollows someone after it's starting phase, so reset the feed cache everytime a user follows or unfollows a particular user, but posts are added very quickly, so fanout them, and if more jobs are fetched add them to the feed cache, ([for later times]and maybe add a ttl, so that memory would not be wasted for inactive users)

const getFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new ObjectId(req.userAuth.userId)
        let anchorId = req.query.anchorId as string | undefined
        
        const userKey = `userFeed:${userId.toHexString()}`


        let posts = await ds.redis.zrange(
            userKey, 
            `${(anchorId)?`(${anchorId}`:'+'}` , 
            '-', 
            'BYLEX', 
            'REV', 
            'LIMIT', 
            0, 
            PAGE_SIZE)

        anchorId = (posts.length>0)?posts[posts.length-1]:anchorId
        const count = posts.length
    
        if(posts.length<PAGE_SIZE)
            posts = posts.concat(await getTimelinePosts(userId, anchorId))


        // caching these posts

        const pipeline = ds.redis.pipeline();
        
        for(let i=count;i<posts.length;i++)
            pipeline.zadd(userKey, 0, posts[i]);
        
        // @ts-ignore
        pipeline.reduceToLimit(userKey, CACHE_LIMIT)
        await pipeline.exec()


        res.status(StatusCodes.OK).send({posts})
    } catch (error) {
        console.log('error here .... ', error);
        next(error)
    }
}

export {getFeed}