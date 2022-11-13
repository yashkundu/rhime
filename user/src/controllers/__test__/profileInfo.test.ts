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


it('updating the user profile without authentication',async () => {
    await request(app)
    .patch(`/api/user/${user.userId}/profile`)
    .expect(StatusCodes.UNAUTHORIZED)
})

it('sending invalid data to update the profile',async () => {
    const cookie = await authenticate()

    await request(app)
    .patch(`/api/user/${user.userId}/profile`)
    .send({firstName: 'yash kundu'})
    .set('Cookie', cookie)
    .expect(StatusCodes.BAD_REQUEST)

    await request(app)
    .patch('/api/user/${user.userId}/profile')
    .send({firstName: 'yashKundu', gender: 'someelse'})
    .set('Cookie', cookie)
    .expect(StatusCodes.BAD_REQUEST)

})

it('sending valid data to update the profile',async () => {
    const cookie = await authenticate()

    await request(app)
    .patch(`/api/user/${user.userId}/profile`)
    .send({firstName: 'yashNOTKundu'})
    .set('Cookie', cookie)
    .expect(StatusCodes.OK)

    await request(app)
    .patch(`/api/user/${user.userId}/profile`)
    .send({firstName: 'yashKundu', gender: 'male'})
    .set('Cookie', cookie)
    .expect(StatusCodes.OK)


    await request(app)
    .patch(`/api/user/${user.userId}/profile`)
    .send({firstName: 'yashKundu', lastName: '', gender: 'male'})
    .set('Cookie', cookie)
    .expect(StatusCodes.OK)

})

it('getting non existing user info', async () => {
    const cookie = await authenticate()

    await request(app)
    .get(`/api/user/${new ObjectId()}/profile`)
    .set('Cookie', cookie)
    .expect(StatusCodes.NOT_FOUND)
})


it('getting existing user info', async () => {
    const cookie = await authenticate()

    const response = await request(app)
    .get(`/api/user/${user.userId}/profile`)
    .set('Cookie', cookie)
    .expect(StatusCodes.OK)

    expect(response.body.userName).toEqual(user.userName)
})