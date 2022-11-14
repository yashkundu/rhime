import {app} from './app'
import {mongo} from './db/mongo'
import { ltTaskQueue } from './ltTaskQueue'

import {nats} from '@rhime/events'


const scheduleUpdates = async () => {
    //sheduled for 2:30 (am) at every Monday :)
    await ltTaskQueue.queue.add('scheduledFetch', {}, {
        repeat: {
            pattern: '* 30 2 * * 1',
            limit: 1
        },
        jobId: 'scheduledFetchJob'
    })
}



const start = async () => {
    try {
        // implement a fucntion to check if all the env variables are set
        // other throw a big nasty error :)
        // envCheckerFunc() 
        const envVariables = ['APP_PORT', 'mongo_url', 'nats_url', 'redis_url']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = 'mongodb://' + process.env.mongo_url + '/?directConnection=true'

        await mongo.connect(mongo_url)
        console.log('Spotify service connected to MongoDb ... ');

        await nats.connect({
            servers: process.env.nats_url
        })
        console.log('Spotify service connected to NATS ... ');

        const host = (process.env.redis_url as string).split(':')[0]
        const port = Number((process.env.redis_url as string).split(':')[1])


        await ltTaskQueue.connect({
            host: host,
            port: port
        })
        console.log('BullMQ\'s ltQueue to the service ... ')

        await scheduleUpdates()

        // await ltTaskQueue.queue.add('initialFetch', {
        //     userId: 'e0b4dcb58f22eb50dd54ea68'
        // })

        // await ltTaskQueue.queue.add('scheduledFetch', {})

        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Spotify service listening on port ${process.env.APP_POR}...`);

        })
        
    } catch (error) {
        console.log(error);
    }
}

start()


