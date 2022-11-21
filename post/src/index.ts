import {app} from './app'
import {mongo} from './db/mongo'

import {nats} from '@rhime/events'


const start = async () => {
    try {

        // implement a fucntion to check if all the env variables are set
        // other throw a big nasty error :)
        // envCheckerFunc() 
        const envVariables = ['APP_PORT', 'mongo_url', 
        'nats_url', 'mongo_username', 'mongo_password']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}${process.env.mongo_url}`;

        await mongo.connect(mongo_url)
        console.log('Post service connected to MongoDb ... ');

        await nats.connect({
            servers: process.env.nats_url
        })
        console.log('Post service connected to NATS ... ');

        
        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Post service is listening on port ${process.env.APP_PORT}...`);
        })
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

start()


