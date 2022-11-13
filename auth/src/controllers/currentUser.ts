import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export const currentUser = async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json(req.userAuth)
}