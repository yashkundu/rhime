import { Request, Response, NextFunction } from "express";
import { Post } from "../db/collections/postCollection";
import {ObjectId} from 'bson'
import { NotFoundError, UnauthorizedError } from "@rhime/common";


export const tightlyAuthorizedPost = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userAuth.userId
    const postId = req.params.postId

    const post = await Post.findOne({_id: new ObjectId(postId)})
    if(!post) throw new NotFoundError('Post cannot not found')

    if(post.userId.toHexString() !== userId) 
        throw new UnauthorizedError('Not authorized to access this resource')

    next()
}