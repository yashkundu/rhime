import {JsMsg} from 'nats'
import {UserFeedStaledEvent} from '@rhime/events'

import { ds } from '../ds/redis'


const userFeedStaledHandler = async (event: UserFeedStaledEvent, msg: JsMsg) => {
    const userId = event.userId;
    const key = `userFeed:${userId}`;
    await ds.redis.del(key);
    msg.ack();
}

export {userFeedStaledHandler}