import {mongo} from './db/mongo'

import {nats, subject, noun, verb, LikeToggledEvent} from '@rhime/events'
import { likeToggledHandler, natsEmitter, acknowledge } from './handlers/likeToggledHandler'
import { consumerOpts, JetStreamPullSubscription } from 'nats'
import { EVENT_BATCH_SIZE, BATCH_UPDATE_TIME } from './config'

import { updateDB } from './utils'


const batchUpdater = async () => {
    await updateDB()
    setTimeout(batchUpdater, BATCH_UPDATE_TIME)
}


const pullMsgs = (pullConsumer: JetStreamPullSubscription) => {
    console.log('Pulling messages : ');
    pullConsumer.pull({
        batch: EVENT_BATCH_SIZE
    });
}

const start = async () => {
    try {

        await mongo.connect('mongodb://127.0.0.1:27017/?directConnection=true')
        console.log('Like-BatchUpdater service connected to MongoDb ... ');

        await nats.connect({
            servers: process.env.nats_url
        })
        console.log('Like-BatchUpdater service connected to NATS ... ');

        const js = nats.js


        const opts = consumerOpts()
        opts.durable(`${noun.like}-${verb.toggled}-likeBatchUpdater-consumer`)
        opts.ackExplicit()
        opts.manualAck()
        opts.ackWait(1000*10)


        const pullConsumer = await js.pullSubscribe(subject(noun.like, verb.toggled), opts);
        console.log(`Like BatchUpdater subscribed to ${subject(noun.like, verb.toggled)} subject`);

        (async () => {
            for await (const msg of pullConsumer) {
                try {
                    console.log(Buffer.from(msg.data).toString())
                    likeToggledHandler(
                        JSON.parse(Buffer.from(msg.data).toString()) as LikeToggledEvent, 
                        msg)
                } catch (error) {
                    console.log(error);
                    acknowledge(msg);
                }
            }
        })()
        natsEmitter.on('finished', () => {
            pullMsgs(pullConsumer);
        })
        pullMsgs(pullConsumer);
        pullConsumer.closed.then(() => console.log('Subscription closed :('));

        
        setTimeout(batchUpdater, BATCH_UPDATE_TIME);

        
    } catch (error) {
        console.log(error);
    }
}

start()


