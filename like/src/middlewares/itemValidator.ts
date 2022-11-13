import {Request, Response, NextFunction} from 'express'
import { ValidItem } from '../db/collections/validItemCollection'
import { BadRequestError } from '@rhime/common'
import {ObjectId} from 'bson'

const itemValidator = async (req: Request, res: Response, next: NextFunction) => {
    const validItem = await ValidItem.findOne({_id: new ObjectId(req.params.itemId)})
    if(!validItem) throw new BadRequestError('No such Item exists')
    next()
}

export {itemValidator}