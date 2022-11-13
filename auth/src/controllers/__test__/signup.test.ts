import request from 'supertest'
import { app } from '../../app'
import {StatusCodes} from 'http-status-codes'
import {user, User} from '../../db/collections/userCollection'

const obj = {
    userName: "yashkundu",
    email: "yashkundu@gmail.com",
    password: "yashkundu@123"
}

it('Signing up with invalid data', async () => {

    const makeRequest = (obj: any) => request(app)
    .post('/api/auth/signup')
    .send(obj)
    .expect(StatusCodes.BAD_REQUEST);

    await makeRequest({...obj, email:'yash@agd'})
    await makeRequest({...obj, userName: '.adfafg'})
    await makeRequest({...obj, email: undefined})
})


it('Correctly signing up', async () => {

    const response = await request(app)
    .post('/api/auth/signup')
    .send(obj)
    .expect(StatusCodes.CREATED)

    expect(response.body.acknowledged).toBeTruthy()
})


it('Email or userName already exists Error', async () => {
    await request(app)
    .post('/api/auth/signup')
    .send(obj)
    .expect(StatusCodes.CREATED)

    await request(app)
    .post('/api/auth/signup')
    .send(obj)
    .expect(StatusCodes.BAD_REQUEST)

    await request(app)
    .post('/api/auth/signup')
    .send({...obj, email: 'someother@gmail.com'})
    .expect(StatusCodes.BAD_REQUEST)

})



it('checking the User collection after signing up', async () => {
    await request(app)
    .post('/api/auth/signup')
    .send(obj)
    .expect(StatusCodes.CREATED)

    const user = await User.findOne({email: obj.email})
    expect(user).toBeTruthy()
    expect(user?._id).toBeTruthy()
    expect(user?.email).toBe(obj.email)
    expect(user?.userName).toBe(obj.userName)
})
