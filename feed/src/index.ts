import {app} from './app'
import {mongo} from './db/mongo'
import { ds } from './ds/redis'


import {nats, PostCreatedEvent, UserFeedStaledEvent, subject, noun, verb} from '@rhime/events'


import { postCreatedHandler } from './handlers/postCreatedHandler'
import { userFeedStaledHandler } from './handlers/userFeedStaledHandler'

const initNATS = async () => {
    await nats.connect({
        servers: process.env.nats_url
    })
    console.log('Feed service connected to NATS ... ');

    await nats.subscribe<PostCreatedEvent>(subject(noun.post, verb.created), {
        durableName: `${noun.post}-${verb.created}-feed-consumer`,
        deliverySubject: `${noun.post}-${verb.created}-feed-subject`,
        deliveryGroup: `${noun.post}-${verb.created}-feed-group`
    }, postCreatedHandler)


    await nats.subscribe<UserFeedStaledEvent>(subject(noun.user, verb.feedStaled), {
        durableName: `${noun.user}-${verb.feedStaled}-feed-consumer`,
        deliverySubject: `${noun.user}-${verb.feedStaled}-feed-subject`,
        deliveryGroup: `${noun.user}-${verb.feedStaled}-feed-group`
    }, userFeedStaledHandler)

}


const start = async () => {
    try {
        const envVariables = ['APP_PORT', 'mongo_url', 
        'nats_url', 'redis_url', 'userGraphView_url']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = 'mongodb://' + process.env.mongo_url + '/?directConnection=true'

        await mongo.connect(mongo_url)
        console.log('Feed service connected to MongoDb ... ');


        const host = (process.env.redis_url as string).split(':')[0]
        const port = Number((process.env.redis_url as string).split(':')[1])

        await ds.connect({
            host: host,
            port: port
        })
        console.log('Feed service connected to Redis instance ... ');

        ds.defineCommands()

        await initNATS();

        app.listen(Number(process.env.APP_PORT as string), async () => {
            console.log(`Feed service is listening on port ${process.env.APP_PORT}...`);
        })
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

start()


