import { Request, Response } from "express";
import { UserProfile } from "../db/collections/userProfileCollection";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "@rhime/common";
import {ObjectId} from 'bson'



const getName = async (req: Request, res: Response) => {
    const getterUserId = new ObjectId(req.params.userId)
    const profileInfo = await UserProfile.findOne({_id: getterUserId})
    if(!profileInfo) throw new NotFoundError('Resource not found')
    const name = {
        firstName: profileInfo.firstName,
        lastName: (profileInfo.lastName || "")
    }
    res.status(StatusCodes.OK).send(name)
}


export {getName}