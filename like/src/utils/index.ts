import {ObjectId} from 'bson'

import { ValidItem } from '../db/collections/validItemCollection'

const insertValidItem = async (itemId: ObjectId) => {
    await ValidItem.insertOne({_id: itemId})
}

export {insertValidItem}