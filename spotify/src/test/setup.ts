import { mongo } from "../db/mongo";
import {app} from '../app'

beforeAll(async () => {
    await mongo.connect('mongodb://127.0.0.1:27017')
})

beforeEach(async () => {
    const collections = await mongo.db.collections()
    for(const collection of collections){
        try {
            await collection.drop()
        } catch (error) {}
    }
})


afterAll(async () => {
    const collections = await mongo.db.collections()
    for(const collection of collections){
        try {
            await collection.drop()
        } catch (error) {}
    }
    await mongo.client?.close()
})