import {app} from './app'
import {mongo} from './db/mongo'
import {nats} from '@rhime/events'

import { UserAuthorizedEvent, noun, verb, subject } from '@rhime/events'

import { userAuthorizedHandler } from './handlers/userAuthorizedHandler'


const initNATS = async () => {
    await nats.connect({
        servers: process.env.nats_url
    })
    console.log('Auth service connected to NATS ... ');

    await nats.subscribe<UserAuthorizedEvent>(subject(noun.user, verb.authorized), {
        durableName: `${noun.user}-${verb.authorized}-auth-consumer`,
        deliverySubject: `${noun.user}-${verb.authorized}-auth-subject`,
        deliveryGroup: `${noun.user}-${verb.authorized}-auth-group`
    }, userAuthorizedHandler)
}





const start = async () => {
    try {

        const envVariables = ['ACCESS_TOKEN_SECRET', 'SIGNED_COOKIE_SECRET',
         'APP_PORT', 'nats_url', 'mongo_url']

        for(const x of envVariables){
            if(!process.env[x]) {
                console.error(`Not declared : ${x}`)
                throw new Error('Environment variables not declared')
            }
        }

        const mongo_url = 'mongodb://' + process.env.mongo_url + '/?directConnection=true'

        await mongo.connect(mongo_url)
        console.log('Auth service connected to MongoDb ... ');

        await initNATS()
        
        // AUTOMATIC DNS RESOLUTION IN DOCKER

        app.listen(Number(process.env.APP_PORT), async () => {
            console.log(`Auth service listening on port ${Number(process.env.APP_PORT)}...`);
        })
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

start()

