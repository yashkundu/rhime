import {Request, Response} from 'express'
import {ObjectId} from 'bson'
import { StatusCodes } from 'http-status-codes'

import { BadRequestError } from '@rhime/common'
import { Comment, comment } from '../db/collections/commentCollection'
import { nats, subject, noun, verb, CommentCreatedEvent } from '@rhime/events' 
import { WithId } from 'mongodb'


const createComment = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.userAuth.userId)
    const postId = new ObjectId(req.params.postId)

    const charLimit = 120;
    if(!req.body.text) throw new BadRequestError('No text present.');
    if(req.body.text.length>charLimit) throw new BadRequestError(`Comment should be less than ${charLimit} characters.`)


    const comment: comment = {
        postId: postId, 
        userId: userId,
        text: req.body.text as string
    }

    await Comment.insertOne(comment)

    await nats.publish<CommentCreatedEvent>(subject(noun.comment, verb.created), {
        commentId: (comment as WithId<comment>)._id.toHexString(),
        userId: req.userAuth.userId
    })

    res.sendStatus(StatusCodes.CREATED)
}

export {createComment}