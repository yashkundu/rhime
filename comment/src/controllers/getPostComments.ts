import { Request, Response } from "express";
import {ObjectId} from 'bson'

import { Comment } from "../db/collections/commentCollection";
import { PAGE_SIZE } from "../config";

import { StatusCodes } from "http-status-codes";


const getPostComments = async (req: Request, res: Response) => {
    const anchorId = (req.query.anchorId)?(new ObjectId(req.query.anchorId as string)): null
    const postId = new ObjectId(req.params.postId)

    const matchObj: {[key: string]: any} = {
        postId: postId
    }
    if(anchorId) matchObj._id = {$lt: anchorId}


    const comments = (await Comment.aggregate([
        {
            $match: matchObj
        },
        {
            $sort: {_id: -1}
        },
        {
            $limit: PAGE_SIZE
        }
    ]).toArray()).map(comment => ({
        commentId: comment._id,
        userId: comment.userId,
        text: comment.text,
        timeStamp: (comment._id as ObjectId).getTimestamp()
    }))

    res.status(StatusCodes.OK).send({comments: comments})

}

export {getPostComments}