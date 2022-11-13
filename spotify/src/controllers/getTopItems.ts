import {Response, Request} from 'express'

import { Item } from '../db/collections/itemCollection'
import { StatusCodes } from 'http-status-codes'

import {ObjectId} from 'bson'

// only store X top items of a particular user, no need to paginate
const getTopItems = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId as string)

    let arr = await Item.find({
        '_id.userId': userId
    }).toArray()

    const items = arr.map(item => ({
        itemId: item._id.itemId,
        type: item.itemType,
        wt: Number(item.wt.toString())
    }))

    res.status(StatusCodes.OK).send({items})

}

export {getTopItems}