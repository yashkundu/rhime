import express from 'express'

const router = express.Router()

import { paramObjectIdValidator } from '@rhime/common'

import {getFeed} from '../controllers/getFeed'
import {getProfileFeed} from '../controllers/getProfileFeed'


router.route('/').get(getFeed)
router.route('/:userId').get(paramObjectIdValidator('userId'), getProfileFeed)


export {router as feedRouter}