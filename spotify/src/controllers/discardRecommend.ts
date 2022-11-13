import { Request, Response } from "express";
import {ObjectId} from 'bson'
import { Recommend } from "../db/collections/recommendCollection";
import { StatusCodes } from "http-status-codes";


const discardRecommend = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.userAuth.userId)
    const recUserId = new ObjectId(req.params.userId)
    await Recommend.updateOne({'_id.userId1': userId, '_id.userId2': recUserId}, {
        $set: {isValid: false}
    })
    res.sendStatus(StatusCodes.OK)
}

export {discardRecommend}