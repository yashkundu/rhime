import {app} from './app'
import {mongo} from './db/mongo'

import { ds } from './ds/redis'

import {nats, PostCreatedEvent, CommentCreatedEvent, subject, noun, verb} from '@rhime/events'

import { postCreatedHandler } from './handlers/postCreatedHandler'
import { commentCreatedHandler } from './handlers/commentCreatedHandler'

const initNATS = async () => {
    await nats.connect({
        servers: process.env.nats_url
    })
    console.log('Like service connected to NATS ... ');

    await nats.subscribe<PostCreatedEvent>(subject(noun.post, verb.created), {
        durableName: `${noun.post}-${verb.created}-like-consumer`,
        deliverySubject: `${noun.post}-${verb.created}-like-subject`,
        deliveryGroup: `${noun.post}-${verb.created}-like-group`
    }, postCreatedHandler)

    await nats.subscribe<CommentCreatedEvent>(subject(noun.comment, verb.created), {
        durableName: `${noun.comment}-${verb.created}-like-consumer`,
        deliverySubject: `${noun.comment}-${verb.created}-like-subject`,
        deliveryGroup: `${noun.comment}-${verb.created}-like-group`
    }, commentCreatedHandler)

}


const start = async () => {
    try {

        const envVariables = ['APP_PORT', 'nats_url', 'mongo_url']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        await mongo.connect('mongodb://127.0.0.1:27017/?directConnection=true')
        console.log('Like service connected to MongoDb ... ');

        await initNATS()

        

        await ds.connect({
            host: '127.0.0.1',
            port: 6379
        })
        console.log('Like service connected to Redis ... ');

        
        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Like service is listening on port ${process.env.APP_PORT}...`);
        })
        
    } catch (error) {
        console.log(error);
    }
}

start()


