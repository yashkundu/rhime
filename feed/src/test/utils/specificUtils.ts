import {ObjectId, Long} from 'bson'
import {faker} from '@faker-js/faker'
import { getCookie } from './jwt'
import { user } from './users'
import { post } from './posts'
import { fanOutPost } from '../../handlers/fanOut'
import { profileFeed } from '../../db/collections/profileFeedCollection'
import {mongo} from '../../db/mongo'

export const createUsers = (n: number) => {
    const users = []
    const cookies: string[] = []
    for(let i=0;i<n;i++){
      users.push({
        userId: new ObjectId(),
        userName: faker.internet.userName()
      })
      cookies.push(getCookie({userId: users[i].userId.toHexString(), userName: users[i].userName}))
    }
    return {users, cookies}
}

export const makePosts = async () => {
    const promises = []
    const docs: {_id: {userId: ObjectId; postId: Long}}[] = []

    for(let i=1;i<=500;i++) {
        promises.push(fanOutPost(new ObjectId(user.users[post.posts[i]]), String(i)))
        docs.push({
            _id: {
                userId: new ObjectId(user.users[post.posts[i]]),
                postId: new Long(i)
            }
        })
    }

    await mongo.db.collection<profileFeed>('ProfileFeed').insertMany(docs)
    await Promise.all(promises)
}
