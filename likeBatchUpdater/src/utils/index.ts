import { state } from "../state"

import {ObjectId, Int32} from 'bson'

import {mongo} from '../db/mongo'

import { MONGO_BATCH_SIZE } from "../config"

const updateDB = async () => {
    let counter = 0;
    let builder = mongo.db.collection('RTLikeCount').initializeUnorderedBulkOp()
    for(const [itemId, likes] of Object.entries(state.likes)) {
        counter++;
        builder.find({_id: new ObjectId(itemId)}).upsert().updateOne({
            $inc: {count: new Int32(likes)}
        })
        if(counter===MONGO_BATCH_SIZE) {
            await builder.execute()
            counter = 0;
            builder = mongo.db.collection('ReactionCount').initializeUnorderedBulkOp();
        }
    }
    if(counter>0) await builder.execute();
    state.resetLikes()
    console.log('likeDB updated ... ');
}

export {updateDB}