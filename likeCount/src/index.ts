import {app} from './app'
import {mongo} from './db/mongo'

import {nats} from '@rhime/events'


const start = async () => {
    try {

        const envVariables = ['APP_PORT', 'mongo_url', 
        'nats_url']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = 'mongodb://' + process.env.mongo_url + '/?directConnection=true'


        await mongo.connect(mongo_url)
        console.log('Like-Count service connected to MongoDb ... ');

        await nats.connect({
            servers: process.env.nats_url
        })
        console.log('Like-Count service connected to NATS ... ');

        
        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Like-Count service is listening on port ${process.env.APP_PORT}...`);

        })
        
    } catch (error) {
        console.log(error);
    }
}

start()


