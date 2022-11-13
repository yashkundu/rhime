import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from '@rhime/common';

export const looselyAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    const anotherUserId = req.params.userId
    if(req.userAuth.userId === anotherUserId) throw new ForbiddenError('Forbidden')
    next()
}

