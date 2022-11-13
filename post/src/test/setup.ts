jest.mock('../db/mongo')
import { mongo } from "../db/mongo";



beforeAll(async () => {
    await mongo.connect('mongodb://127.0.0.1:27017/?directConnection=true')
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