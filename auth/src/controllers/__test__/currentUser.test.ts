import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'

const obj = {
    userName: "yashkundu",
    email: "yashkundu@gmail.com",
    password: "yashkundu@123"
}

const signin = async () => {
    await request(app)
    .post('/api/auth/signup')
    .send(obj)
    .expect(StatusCodes.CREATED)

    const response = await request(app)
    .post('/api/auth/signin')
    .send({email: obj.email, password: obj.password})
    .expect(StatusCodes.OK)

    return response.headers['set-cookie']
}


it('Unauthenticated request', async () => {
    const response = await request(app)
    .get('/api/auth/currentUser')
    .expect(StatusCodes.UNAUTHORIZED)

    expect(response.body.errors[0].refresh).toBeTruthy()
})

it('Correctly gives the current user', async () => {
    const cookies = await signin()
    const accessToken = cookies[0].split('; ')[0]

    const response = await request(app)
    .get('/api/auth/currentUser')
    .set('Cookie', accessToken)
    .expect(StatusCodes.OK)

    expect(response.body.userName).toEqual(obj.userName)

})