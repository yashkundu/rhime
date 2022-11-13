jest.mock('../db/mongo')
jest.mock('../services/userGraphView')
import { mongo } from "../db/mongo";
import {ds} from '../ds/redis' 


beforeAll(async () => {
    await mongo.connect('mongodb://127.0.0.1:27017/?directConnection=true')
    await ds.connect({
        host: '127.0.0.1',
        port: 6379
    })
    ds.defineCommands()
})

beforeEach(async () => {
    const collections = await mongo.db.collections()
    for(const collection of collections){
        try {
            await collection.drop()
        } catch (error) {}
    }
    await ds.redis.flushall()
})


afterAll(async () => {
    const collections = await mongo.db.collections()
    for(const collection of collections){
        try {
            await collection.drop()
        } catch (error) {}
    }
    await ds.redis.flushall()
    
    await mongo.client?.close()
    await ds.redis.quit()
})