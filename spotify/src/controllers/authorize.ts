import { Request, Response } from "express";
import crypto from 'crypto'

const userScopes = [
    'user-top-read'
]



export const authorize = (req: Request, res: Response) => {

    const state = crypto.randomBytes(8).toString('hex')
    const scope = userScopes.join(' ')
    const redirect_uri = `${process.env.gateway_url}/api/spotify/callback`

    const qs = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_KEY as string,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: 'true'
    })

    res.redirect('https://accounts.spotify.com/authorize?' + qs.toString())
}