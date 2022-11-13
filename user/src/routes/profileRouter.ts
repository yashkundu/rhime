import express from 'express'
const router = express.Router({mergeParams: true})

import {getProfileInfo, updateProfileInfo, getPostProfile} from '../controllers/profileInfo'
import { uploadProfileImage, deleteProfileImage } from '../controllers/profileImage'
import { getName } from '../controllers/getName'

import {SchemaValidator, paramObjectIdValidator} from '@rhime/common'
import {userProfileSchema} from '../schemas/userProfileSchema'
import {tightlyAuthorized} from '../middlewares/tightlyAuthorized'

router.use(paramObjectIdValidator('userId'))

router.route('/')
    .patch(tightlyAuthorized, SchemaValidator(userProfileSchema), updateProfileInfo)
    .get(getProfileInfo)

router.route('/forPost')
.get(getPostProfile)

router.route('/image')
    .put(tightlyAuthorized, uploadProfileImage)
    .delete(tightlyAuthorized, deleteProfileImage)

router.route('/name')
.get(getName)


export {router as profileRouter}