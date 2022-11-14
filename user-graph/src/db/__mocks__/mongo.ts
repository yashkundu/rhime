import { MongoClient, Db } from "mongodb";

class MongoWrapper {
    private _db?: Db;
    private _client?: MongoClient

    get db(){
        if(!this._db){
            throw new Error('Mongo instance is not connected')
        }
        return this._db
    }

    get client(){
        if(!this._client){
            throw new Error('Mongo instance is not connected')
        }
        return this._client
    }

    async connect(mongoURI: string){
        const client = new MongoClient(mongoURI)
        await client.connect()
        this._client = client
        this._db = client.db('mockUserGraph')
    }

}

export const mongo = new MongoWrapper()