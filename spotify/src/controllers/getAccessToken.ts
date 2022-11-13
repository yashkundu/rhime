import {Request, Response} from 'express'
import { StatusCodes } from 'http-status-codes'


const getAccessToken = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send(req.accessToken)
}


export {getAccessToken}