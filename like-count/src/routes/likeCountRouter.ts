import express from 'express'

const router = express.Router()

import {getLikeCount} from '../controllers/getLikeCount'


import {paramObjectIdValidator} from '@rhime/common'

// not checking valid item because it's just a get request :)
router.route('/:itemId')
.get(paramObjectIdValidator('itemId'), getLikeCount)


export {router as likeCountRouter}