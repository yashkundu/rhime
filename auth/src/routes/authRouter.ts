import express from 'express'


import { isAuthenticated, RequiredConstraint, SchemaValidator, UniqueConstraint } from '@rhime/common'


import { User, UserFields } from '../db/collections/userCollection'

import { userSchema } from '../schemas/userSchema'

import { signup, signin, signout, currentUser } from '../controllers'

const router = express.Router()


router.post('/signup', [SchemaValidator(userSchema), UniqueConstraint(UserFields.email, User), UniqueConstraint(UserFields.userName, User)] , signup)
router.post('/signin', RequiredConstraint([UserFields.userName, UserFields.password]),  signin)
router.post('/signout', signout)
router.get('/currentUser', isAuthenticated, currentUser)


export {router as authRouter}