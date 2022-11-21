import {app} from './app'
import {mongo} from './db/mongo'

import {nats, UserCreatedEvent, noun, verb, subject} from '@rhime/events'

import { userCreatedHandler } from './handlers/userCreatedHandler'


const initNATS = async () => {
    await nats.connect({
        servers: process.env.nats_url
    })
    console.log('User service connected to NATS ... ');

    await nats.subscribe<UserCreatedEvent>(subject(noun.user, verb.created), {
        durableName: `${noun.user}-${verb.created}-user-consumer`,
        deliverySubject: `${noun.user}-${verb.created}-user-subject`,
        deliveryGroup: `${noun.user}-${verb.created}-user-group`
    }, userCreatedHandler)

}




const start = async () => {
    try {

        // implement a fucntion to check if all the env variables are set
        // other throw a big nasty error :)
        // envCheckerFunc() 
        const envVariables = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY',
        'APP_PORT', 'mongo_url', 'nats_url', 'mongo_username', 'mongo_password']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}${process.env.mongo_url}`;

        await mongo.connect(mongo_url)
        console.log('User service connected to MongoDb ... ');

        await initNATS()

        app.listen(Number(process.env.APP_PORT as string), async () => {
            console.log(`User service listening on port ${process.env.APP_PORT}...`);

        })
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

start()


