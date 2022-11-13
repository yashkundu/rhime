import {Request, Response} from 'express'

import { StatusCodes } from 'http-status-codes'

import { ItemLike } from '../db/collections/ItemLikeCollection'
import {ObjectId} from 'bson'

import { ds } from '../ds/redis'
import { LIKES_TIME_LIMIT } from '../config'

const isItemLiked = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.userAuth.userId)
    const itemId = new ObjectId(req.params.itemId)

    const type = await ds.redis.eval(`
        local itemId = ARGV[1];
        redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[2]);
        if (redis.call('ZRANK', KEYS[1], itemId .. ':0') ~= false) then return '0';
        elseif (redis.call('ZRANK', KEYS[1], itemId .. ':1') ~= false) then return '1';
        end
        return false;
    `, 1, `userLike:${req.userAuth.userId}`, req.params.itemId, Date.now() - LIKES_TIME_LIMIT);

    if(type!==null) {
        return res.status(StatusCodes.OK).send({isLiked: (type==='1')})
    }

    const itemRes = await ItemLike.findOne({_id: {itemId: itemId, userId: userId}})
    res.status(StatusCodes.OK).send({isLiked: Boolean(itemRes)})
}

export {isItemLiked}