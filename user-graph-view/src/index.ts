import * as dotenv from 'dotenv'
dotenv.config()
import {mongo} from './db/mongo'
import path from "path"
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { Minion } from './db/collections/minionCollection'
import { Messiah } from './db/collections/messiahCollection'
import { Minions } from './interfaces/minionsInterface'
import { Messiahs } from './interfaces/messiahsInterface'
import { SingleUser } from './interfaces/userInterface'

import {ObjectId} from 'bson'


// const userId = new ObjectId('208e8551b309b22d2bdfc6d8')


const PROTO_PATH = path.join(__dirname, '/protos', '/userGraph.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    defaults: true,
    oneofs: true
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const protoPkg = protoDescriptor.pkg



async function getMinions(call: grpc.ServerWritableStream<SingleUser, Minions>){
    console.log('getMinions Request from user : ', call.request.userId);
    try {
        console.log('Requested userId -> ', call.request.userId)
        const cursor = Minion.find({messiahId: new ObjectId(call.request.userId)})
        while(await cursor.hasNext()){
            const docs = cursor.readBufferedDocuments()
            const list: Buffer[] = []
            docs.forEach((doc) => {
                list.push(doc.minionId.id)
            })
            console.log('Minions list -> ', list)
            call.write({userIds: list})
        }
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        console.log('ended stream')
        call.end();
    }
}

async function getMessiahs(call: grpc.ServerWritableStream<SingleUser, Messiahs>){
    console.log('getMessiahs Request from user : ', call.request.userId);
    try {
        console.log('Requested userId -> ', call.request.userId)
        const cursor = Messiah.find({minionId: new ObjectId(call.request.userId)})
        while(await cursor.hasNext()){
            const docs = cursor.readBufferedDocuments()
            console.log('Fetched docs -> ', docs)
            const list: Buffer[] = []
            docs.forEach((doc) => {
                list.push(doc.messiahId.id)
            })
            console.log('Messiahs list -> ', list)
            call.write({userIds: list})
        }
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        console.log('ended stream')
        call.end();
    }
    
}

// const populate = async () => {
//     for(let i=0;i<100;i++) {
//         await Minion.insertOne({
//             messiahId: userId,
//             minionId: new ObjectId()
//         })
//     }
// }




const start = async () => {
    try {

        const envVariables = ['APP_PORT', 'mongo_url', 'mongo_username', 'mongo_password']

        for(const x of envVariables){
            if(!process.env[x]) throw new Error('Environment variables not declared')
        }

        const mongo_url = `mongodb+srv://${process.env.mongo_username}:${process.env.mongo_password}${process.env.mongo_url}`;

        await mongo.connect(mongo_url)
        console.log('User Graph View service connected to MongoDb ... ');
        
        const server = new grpc.Server()
        // @ts-ignore
        server.addService(protoPkg.UserGraphView.service, {getMinions: getMinions, getMessiahs: getMessiahs})

        server.bindAsync(`0.0.0.0:${process.env.APP_PORT}`, grpc.ServerCredentials.createInsecure(),async (error) => {
            if (error) {
                console.log(error);
            }
            server.start()
            console.log(`User Graph View server started listening on port ${process.env.APP_PORT}...`)

        })

    } catch (error) {
        console.log(error)
        throw error
    }
}


start()





