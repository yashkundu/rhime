import express from 'express'

const router = express.Router()

import { paramObjectIdValidator, queryObjectIdValidator } from '@rhime/common'

import { postValidator } from '../middlewares/postValidator'

import {createComment} from '../controllers/createComment'
import {getPostComments} from '../controllers/getPostComments'
import {getNumComments} from '../controllers/getNumComments'



router.route('/:postId')
.post(paramObjectIdValidator('postId'), postValidator, createComment)
.get(paramObjectIdValidator('postId'), queryObjectIdValidator('anchorId'), getPostComments)

router.route('/:postId/count')
.get(paramObjectIdValidator('postId'), getNumComments)

export {router as commentRouter}
