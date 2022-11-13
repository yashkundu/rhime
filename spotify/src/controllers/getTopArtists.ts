import {Response, Request} from 'express'

import { Item } from '../db/collections/itemCollection'
import { StatusCodes } from 'http-status-codes'

import {ObjectId} from 'bson'

// only store X top items of a particular user, no need to paginate
const getTopArtists = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId as string)

    const artists = await Item.aggregate([
        {
            $match: {
                '_id.userId': userId,
                itemType: '1'
            }
        },
        {
            $sort: {wt: -1}
        },
        {
            $project: {_id: 0, artistId: '$_id.itemId'}
        }
    ]).toArray()

    res.status(StatusCodes.OK).send({artists})

}

export {getTopArtists}