import { ValidUser } from '../../db/collections/validUserCollections'
import {ObjectId, Int32} from 'bson'
import {faker} from '@faker-js/faker'
import { getCookie } from './jwt'


export const createUsers = async (n: number) => {
    const users: {minionCount: Number | Int32, messiahCount: Number | Int32, _id?: ObjectId, userName?: string}[] = []
    const cookies: string[] = []
    const promises = []
  
    for(let i=0;i<n;i++){
      promises.push(ValidUser.insertOne(users[i] = {
        minionCount: new Int32(0),
        messiahCount: new Int32(0)
      }))
      users[i].userName = faker.internet.userName()
      cookies[i] = getCookie({userId: users[i]._id!.toHexString(), userName: users[i].userName!})
    }
    
    await Promise.all(promises)
    return {users, cookies}
}
