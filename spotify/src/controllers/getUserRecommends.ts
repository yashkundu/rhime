import { Request, Response } from "express";
import {ObjectId} from 'bson'
import { Recommend } from "../db/collections/recommendCollection";
import { StatusCodes } from "http-status-codes";
import {RECOMMEND_BATCH_SIZE} from '../config'

// offset will always be zero. Using it will making updating the code in future
// (_id.userId, isValid, similarity)  -- index
const getUserRecommends = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.userAuth.userId)

    const cursor = Recommend.aggregate([
        {
            $match: {'_id.userId1': userId, isValid: true}
        },
        {
            $sort: {similarity: -1}
        },
        {
            $limit: RECOMMEND_BATCH_SIZE
        }
    ])

    const docs = await cursor.toArray()
    const recommends = docs.map(doc => {
        return {
            userId: doc._id.userId2,
            similarity: doc.similarity
        }
    })
    
    res.status(StatusCodes.OK).send({recommends: recommends})
}

export {getUserRecommends}