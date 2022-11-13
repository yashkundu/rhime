import axios from "axios";
import { Request, Response } from "express";
import { Token } from "../db/collections/tokenCollection"; 
import { ObjectID } from "bson";

import { ltTaskQueue } from "../ltTaskQueue";

import {nats, UserAuthorizedEvent, subject, noun, verb} from '@rhime/events'




export const callback = async (req: Request, res: Response) => {
    
    const {code, state} = req.query
    const redirect_uri = `${process.env.gateway_url}/api/spotify/callback`

    if(!code){
        // authorization failed
        return res.redirect(`/auth/spotify?error=${req.query.error}`)
    }
    
    try {
        const {data} = await axios.post('https://accounts.spotify.com/api/token/', 
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    'Authorization': `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_KEY + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
                }
            }
        )
        const info = await Token.insertOne({
            _id: new ObjectID(req.userAuth.userId), 
            access_token: data.access_token as string,
            refresh_token: data.refresh_token as string,
            expiration: new Date(Date.now() + (data.expires_in-10)*1000)
        })

        console.log('Token inserted in spotifyDb');
        

        if(!info.acknowledged) throw new Error('Error in inserting the info doc')

        await nats.publish(subject(noun.user, verb.authorized), {
            userId: req.userAuth.userId
        })


        //push a job to get all the user favourites and find recommends to the 
        // task queue
        const job = await ltTaskQueue.queue.add('initialFetch', {
            userId: req.userAuth.userId
        }, {
            jobId: `initialFetch:${req.userAuth.userId}`
        })

        res.cookie('accessToken', null, {
            httpOnly: true,
            expires: new Date(Date.now())
        })

        // Please sign in again
        return res.redirect('/auth/signin')

    } catch (error) {
        // if error comes maybe offload this task to some worker thread which will
        // keep on trying it unless it succeeds. but there is no much use
        //@ts-ignore
        console.log(error);
        
        res.redirect(`/auth/spotify?error=${'Authorizaion did not happen, try again'}`)
    }
    
}