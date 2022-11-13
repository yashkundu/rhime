import {Request} from 'express'
import { UnauthenticatedError, UnauthorizedError, BadRequestError} from '@rhime/common'


const isAuthenticated = (req: Request) => {
    if(!req.userAuth) throw new UnauthenticatedError('User not authenticated.')
}

const isAuthorized = (req: Request) => {
    if(!req.userAuth.isAuth) throw new UnauthorizedError('User is not authorized.')
}

const isNotAuthorized = (req: Request) => {
    if(req.userAuth.isAuth) throw new BadRequestError('User is already authorized.')
}

export {isAuthenticated, isAuthorized, isNotAuthorized}