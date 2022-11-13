import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const signout = (req: Request, res: Response) => {
    res.cookie('accessToken', null, {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.sendStatus(StatusCodes.OK)
}

export {signout}
