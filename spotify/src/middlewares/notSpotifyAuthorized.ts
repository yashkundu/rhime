import { Request, Response, NextFunction } from "express";
import {ObjectId} from 'bson'
import { Token } from "../db/collections/tokenCollection";
import { BadRequestError } from "@rhime/common";



const notSpotifyAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    if(req.userAuth.isAuth) throw new BadRequestError('User has already authorized spotify')
    next()
}

export {notSpotifyAuthorized}
