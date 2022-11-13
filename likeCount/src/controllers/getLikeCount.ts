import {Request, Response} from 'express'

import { RTLikeCount } from '../db/collections/RTLikeCount'
import { DailyLikeCount } from '../db/collections/DailyLikeCount'

import {ObjectId} from 'bson'
import { StatusCodes } from 'http-status-codes'

const getLikeCount = async (req: Request, res: Response) => {
    const itemId = new ObjectId(req.params.itemId)

    const rTLike = RTLikeCount.findOne({_id: itemId})
    const dailyLike = DailyLikeCount.findOne({_id: itemId})

    const [rTRes, dailyRes] = await Promise.all([rTLike, dailyLike])

    let count = 0;
    console.log(rTRes);
    if(rTRes) count += Number(rTRes.count.toString());
    if(dailyRes) count += Number(dailyRes.count.toString());

    res.status(StatusCodes.OK).send({count: count})
}

export {getLikeCount}