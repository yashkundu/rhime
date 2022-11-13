import { Request, Response } from "express";
import {ObjectId} from 'bson'
import { StatusCodes } from "http-status-codes";

import { Post, post } from "../db/collections/postCollection";

export const getPostCount = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId);
    const count = await Post.count({
        userId: userId
    })
    res.status(StatusCodes.OK).send({count})
}