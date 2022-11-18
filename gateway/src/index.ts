import { app } from './app';

import {nats, noun} from '@rhime/events'

import { JetStreamManager } from 'nats';


const createStream = async (x: noun, jsm: JetStreamManager) => {
    const subj = `${x}.*`;
    try {
        const name = await jsm.streams.find(subj);
        console.log('Stream name -- ', name);
    } catch (error) {
        await jsm.streams.add({name: `${x}Stream`, subjects: [subj]})
    }
}


const initNats = async () => {
    await nats.connect({
        servers: process.env.nats_url as string
    })
    console.log('Gateway service connected to NATS ... ');
    
    const jsm = await nats.nc.jetstreamManager()

    // creating stream corresponding to every noun :)
    await createStream(noun.user, jsm);
    await createStream(noun.post, jsm);
    await createStream(noun.like, jsm);
    await createStream(noun.comment, jsm);
}


const start = async () => {

    try {

        const envVariables = ['ACCESS_TOKEN_SECRET', 'SIGNED_COOKIE_SECRET', 'APP_PORT', 'nats_url' ]

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }
        
        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Gateway started on port ${process.env.APP_PORT} ...`)
            await initNats()
        })

    } catch (error) {
        console.log(error);
        throw error
    }

    
}


start()







