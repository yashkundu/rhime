// @ts-nocheck
import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'
import { UserProfile } from '../../db/collections/userProfileCollection'
import {ObjectId} from 'bson'
import {faker} from '@faker-js/faker'
import { getCookie } from '../../test/utils/jwt'


const user = {
    userId: new ObjectId(),
    firstName: faker.name.firstName(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    minionCount: 0,
    messiahCount: 0,
}

const authenticate = async () => {
    await UserProfile.insertOne(user)
    const cookie = getCookie({userId: user.userId, userName: user.userName})
    return cookie
}


it('getting a valid url for upload', async () => {

    // const cookie = await authenticate()

    // const response = await request(app)
    // .put(`/api/user/${user.userId}/profile/image`)
    // .set('Cookie', cookie)
    // .expect(StatusCodes.OK)

    // console.log(response.body.url);
    // expect(response.body.url).toBeTruthy()

})