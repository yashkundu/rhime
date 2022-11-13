// Not implemented, will be a lot difficult dealing with the domino of delete events :(
// some later time


// import {Request, Response} from 'express'
// import { Comment } from '../db/collections/commentCollection'
// import { StatusCodes } from 'http-status-codes/build/cjs/status-codes'
// import { NotFoundError, UnauthenticatedError, UnauthorizedError } from '@rhime/common'

// import {ObjectId} from 'bson'

// const deleteComment = async (req: Request, res: Response) => {
//     const userId = new ObjectId(req.userAuth.userId)
//     const commentId = new ObjectId(req.params.commentId)

//     // don't need transaction here
//     const comment = await Comment.findOne({_id: commentId})
//     if(!comment) throw new NotFoundError('Comment not found')

//     if(comment.userId!==userId) throw new UnauthorizedError('Not authorized to access this resource')

//     const deleteRes = await Comment.deleteOne({_id: commentId})

//     res.sendStatus(StatusCodes.OK)

// }

// export {deleteComment}