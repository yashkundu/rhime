import {app} from './app'
import {mongo} from './db/mongo'


import {nats, UserCreatedEvent, subject, noun, verb} from '@rhime/events'


import { userCreatedHandler } from './handlers/userCreatedHandler'


const initNATS = async () => {
    await nats.connect({
        servers: process.env.nats_url
    })
    console.log('User Graph service connected to NATS ... ');

    await nats.subscribe<UserCreatedEvent>(subject(noun.user, verb.created), {
        durableName: `${noun.user}-${verb.created}-userGraph-consumer`,
        deliverySubject: `${noun.user}-${verb.created}-userGraph-subject`,
        deliveryGroup: `${noun.user}-${verb.created}-userGraph-group`
    }, userCreatedHandler)

}




const start = async () => {
    try {

        // implement a fucntion to check if all the env variables are set
        // other throw a big nasty error :)
        // envCheckerFunc() 
        const envVariables = ['APP_PORT', 'mongo_url', 'nats_url']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = 'mongodb://' + process.env.mongo_url + '/?directConnection=true'

        await mongo.connect(mongo_url)
        console.log('User Graph service connected to MongoDb ... ');

        await initNATS()
        
        app.listen(Number(process.env.APP_PORT as string), async () => {
            console.log(`User Graph service listening on port ${process.env.APP_PORT}...`);
        })
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

start()


