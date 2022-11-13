import {Request, Response} from 'express'
import {ObjectId} from 'bson'
import { StatusCodes } from 'http-status-codes'
import {getUserPosts} from '../utils'


const getProfileFeed = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId)
    const anchorId = req.query.anchorId as string | undefined

    let posts: string[] = await getUserPosts(userId, anchorId)
    res.status(StatusCodes.OK).send({posts})
}

export {getProfileFeed}