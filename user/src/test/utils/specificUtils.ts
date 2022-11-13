import { UserProfile } from '../../db/collections/userProfileCollection'
import {ObjectId, Int32} from 'bson'
import {faker} from '@faker-js/faker'
import { getCookie } from './jwt'


export const createUsers = async (n: number) => {
    const users = []
    const cookies: string[] = []
    const promises = []
  
    for(let i=0;i<n;i++){
      promises.push(UserProfile.insertOne(users[i] = {
        userId: new ObjectId(),
        firstName: faker.name.firstName(),
        userName: faker.internet.userName(),
        email: faker.internet.email()
      }))
      cookies[i] = getCookie({userId: users[i].userId.toHexString(), userName: users[i].userName})
    }
    
    await Promise.all(promises)
    return {users, cookies}
}
