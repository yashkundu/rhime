import { Request, Response } from "express";
import { Minion } from "../db/collections/minionCollection";
import { StatusCodes } from "http-status-codes";
import {ObjectId} from 'bson'
import { objectIdValidator } from "@rhime/common";

    
export const getMinions = async (req: Request, res: Response) => {
    const userId = new ObjectId(req.params.userId)
    const lastMinionId = objectIdValidator(req.params.lastMinionId) && new ObjectId(req.params.lastMinionId)
    

    const matchObj: {[key: string]: any} = {
        messiahId: userId
    }

    if(lastMinionId) matchObj.minionId = {$gt: lastMinionId}

    
    const minions = await Minion.aggregate([
        {
            $match: matchObj
        },
        {
            $project : {_id: 0, minionId: 1} 
        }
    ]).limit(20).toArray()
    res.status(StatusCodes.OK).send(minions)
}

