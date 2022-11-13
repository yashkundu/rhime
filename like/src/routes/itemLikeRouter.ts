import express from 'express'

const router = express.Router()

import { toggleItemLike } from '../controllers/toggleItemLike'
import { isItemLiked } from '../controllers/isItemLiked'

import {paramObjectIdValidator} from '@rhime/common'

import {itemValidator} from '../middlewares/itemValidator'

router.route('/:itemId')
.post(paramObjectIdValidator('itemId'), itemValidator,  toggleItemLike)
.get(paramObjectIdValidator('itemId'), isItemLiked)


export {router as itemLikeRouter}