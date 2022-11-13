import express from 'express'

const router = express.Router()

import { paramObjectIdValidator} from '@rhime/common'

import {createPost, getPost, getTrack, getPostCount} from '../controllers'

router.route('/').post(createPost)
router.route('/getPost/:postId').get(paramObjectIdValidator('postId'), getPost)
router.route('/getTrack/:trackId').get(getTrack)
router.route(`/getPostCount/:userId`).get(paramObjectIdValidator('userId'), getPostCount)

export {router as postRouter}