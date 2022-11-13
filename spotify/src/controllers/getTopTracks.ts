import {Response, Request} from 'express'

import { Item } from '../db/collections/itemCollection'
import { StatusCodes } from 'http-status-codes'

import {ObjectId} from 'bson'

// only store X top items of a particular user, no need to paginate
const getTopTracks = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId as string)

    const tracks = await Item.aggregate([
        {
            $match: {
                '_id.userId': userId,
                itemType: '0'
            }
        },
        {
            $sort: {wt: -1}
        },
        {
            $project: {_id: 0, trackId: '$_id.itemId'}
        }
    ]).toArray()

    res.status(StatusCodes.OK).send({tracks})

}

export {getTopTracks}