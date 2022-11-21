import {app} from './app'
import {mongo} from './db/mongo'

import {nats, subject, noun, verb, PostCreatedEvent} from '@rhime/events'

import { postCreatedHandler } from './handlers/postCreatedHandler'

const initNATS = async () => {
    await nats.connect({
        servers: process.env.nats_url
    })
    console.log('Comment service connected to NATS ... ');

    await nats.subscribe<PostCreatedEvent>(subject(noun.post, verb.created), {
        durableName: `${noun.post}-${verb.created}-comment-consumer`,
        deliverySubject: `${noun.post}-${verb.created}-comment-subject`,
        deliveryGroup: `${noun.post}-${verb.created}-comment-group`
    }, postCreatedHandler)
}



const start = async () => {
    try {

        // implement a fucntion to check if all the env variables are set
        // other throw a big nasty error :)
        // envCheckerFunc() 
        const envVariables = ['APP_PORT', 'mongo_url', 'nats_url', 'mongo_username', 'mongo_password']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}${process.env.mongo_url}`;

        await mongo.connect(mongo_url)
        console.log('Comment service connected to MongoDb ... ');

        await initNATS();

        
        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Comment service is listening on port ${process.env.APP_PORT}...`);
        })
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

start()


