import {Request, Response} from 'express'
import { nats, LikeToggledEvent, subject, noun, verb } from '@rhime/events'

import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '@rhime/common'

import { ds } from '../ds/redis'
import { LIKES_TIME_LIMIT } from '../config'

import { v4 as uuidv4 } from 'uuid';

// store a user's recent likes in memory because it will take them some time to persist
// userLikes:userId  -> will store the user's recent likes
// userDislikes:userId -> will store the user's recent dislikes because they will be
// processed in some time
const toggleItemLike = async (req: Request, res: Response) => {
    
    const itemId = req.params.itemId;
    const type = req.query.type;

    // 1 -> like, 0 -> dislike
    if(!type || (type!=='0' && type!=='1')) throw new BadRequestError('Type query not provided')
    
    
    await nats.publish<LikeToggledEvent>(subject(noun.like, verb.toggled), {
        itemId: itemId,
        userId: req.userAuth.userId,
        // 1 -> like -1 -> dislike
        type: Number(type),
        eventId: uuidv4()
    })

    // Storing recent likes or dislike by a user in memory because it will take some
    // time to persist in permanent storage
    // KEYS[1] -> user:userId
    // ARGV[1] -> itemId, ARGV[2] -> type, ARGV[3] -> current TIme, ARGV[4] -> curTime - last x minutes
    await ds.redis.eval(`
        local itemId = ARGV[1];
        local cur = ARGV[2];
        local other = tostring(1 - tonumber(ARGV[2]));
        redis.call('ZREM', KEYS[1], itemId .. ':' .. other);
        redis.call('ZADD', KEYS[1], ARGV[3], itemId .. ':' .. cur);
        redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[4]);
    `, 1, `userLike:${req.userAuth.userId}`, itemId, type, Date.now(), Date.now() - LIKES_TIME_LIMIT);


    res.sendStatus(StatusCodes.OK)
}

export {toggleItemLike}