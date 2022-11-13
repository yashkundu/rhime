import { Request, Response, NextFunction } from "express";
import { Token } from "../db/collections/tokenCollection";

import {BadRequestError} from '@rhime/common'

import {ObjectId} from 'bson'

import axios from "axios";

interface accessTokenProp{
    token: string,
    expDate: Date
}

declare global{
    namespace Express{
        interface Request{
            accessToken: accessTokenProp
        }
    }
}


// checks if the access token has been expired and if refreshes the token
const checkAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    const userId = new ObjectId(req.userAuth.userId)

    const token = await Token.findOne({_id: userId})
    if(!token) throw new BadRequestError('User has not authorized spotify')

    let accessToken = token.access_token
    let expDate = token.expiration

    if(token.expiration<(new Date(Date.now()+10*1000))){
        // refresh the access token

        const {data} = await axios.post('https://accounts.spotify.com/api/token/', 
        new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token
        }).toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_KEY + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
            }
        })
        accessToken = data.access_token
        expDate = new Date(Date.now() + 1000*(data.expires_in - 10))

        await Token.updateOne({_id: userId}, {
            $set: {
                access_token: accessToken,
                expiration: expDate
            }
        })

    }

    req.accessToken = {
        token: accessToken,
        expDate: expDate
    }

    next()

}

export {checkAccessToken}