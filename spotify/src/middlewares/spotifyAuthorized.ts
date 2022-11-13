import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@rhime/common";



const spotifyAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.userAuth || !req.userAuth.isAuth) throw new BadRequestError('User has not authorized spotify')
    next()
}

export {spotifyAuthorized}
