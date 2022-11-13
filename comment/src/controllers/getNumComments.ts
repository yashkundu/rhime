import { Request, Response } from "express";
import {ObjectId} from 'bson'

import { Comment } from "../db/collections/commentCollection";

import { StatusCodes } from "http-status-codes";


const getNumComments = async (req: Request, res: Response) => {
    const postId = new ObjectId(req.params.postId);
    const comments = await Comment.countDocuments({postId})
    res.status(StatusCodes.OK).send({count: comments})
}

export {getNumComments}