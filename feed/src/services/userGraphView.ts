import path from "path"
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const PROTO_PATH = path.join(__dirname, '../protos', '/userGraph.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    defaults: true,
    oneofs: true
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const protoPkg = protoDescriptor.pkg

// @ts-ignore
// const UserGraphView = new protoPkg.UserGraphView(state.endpoint, grpc.credentials.createInsecure());

// export const sexyService = new protoPkg.UserGraphView('127.0.0.1:9700', grpc.credentials.createInsecure());





export const UserGraphView = new protoPkg.UserGraphView(process.env.userGraphView_url, grpc.credentials.createInsecure());