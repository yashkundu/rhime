import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {ObjectId} from 'bson'
import { NotFoundError } from "@rhime/common";
import { ValidUser } from "../db/collections/validUserCollections";

    
export const messiahCount = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId)
    const user = await ValidUser.findOne({_id: userId})
    if(!user) throw new NotFoundError('User not found')
    res.status(StatusCodes.OK).send({messiahCount: user.messiahCount})
}

