import {default as Axios} from 'axios'
import { ObjectId } from 'mongodb';
import { Token } from '../db/collections/tokenCollection'


const axios = Axios.create({
    baseURL: 'https://api.spotify.com/v1/'
})

axios.interceptors.request.use(async (config) => {
    
    if(config.method==='post') return config

    // @ts-ignore
    const userId = new ObjectId(config.headers['Authorization']);
    const token = await Token.findOne({_id: userId})
    console.log('Token : ', token);

    if(!token) throw new Axios.Cancel('Invalid user')

    let access_token = token.access_token

    if(token.expiration<(new Date(Date.now()))){
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
        access_token = data.access_token

        await Token.updateOne({_id: userId}, {
            $set: {
                access_token: data.access_token,
                expiration: new Date(Date.now() + 1000*(data.expires_in - 10))
            }
        })

    }
    
    // @ts-ignore
    config.headers['Authorization'] = `Bearer ${access_token}`
    return config
}, (error) => {
    console.log('Error inside spotify inceptor ... ');
    console.log(error);
    return Promise.reject(error)
})


export {axios}
