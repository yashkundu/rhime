import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'


const obj = {
    userName: "yashkundu",
    email: "yashkundu@gmail.com",
    password: "yashkundu@123"
}

const signup = () => {
    return request(app)
    .post('/api/auth/signup')
    .send(obj)
}


it('Not providing email or password', async () => {
    await request(app)
    .post('/api/auth/signin')
    .send({email: 'yashkund@gmail.com'})
    .expect(StatusCodes.BAD_REQUEST)


    await request(app)
    .post('/api/auth/signin')
    .send({password: 'yashkunasfdvf'})
    .expect(StatusCodes.BAD_REQUEST)
})


it('Email not found or password does not matches', async () => {
    await request(app)
    .post('/api/auth/signin')
    .send({email: 'yashkcdsacsdund@gmail.com', password: 'jgfhg'})
    .expect(StatusCodes.BAD_REQUEST)

    await signup().expect(StatusCodes.CREATED)

    await request(app)
    .post('/api/auth/signin')
    .send({email: obj.email, password: 'jgfhsvcxcvg'})
    .expect(StatusCodes.BAD_REQUEST)
})


it('Successfuly signed in and the cookie is set', async () => {
    await signup().expect(StatusCodes.CREATED)
    const response = await request(app)
    .post('/api/auth/signin')
    .send({email: obj.email, password: obj.password})
    .expect(StatusCodes.OK)
    
    expect(response.headers['set-cookie'][0]).toMatch(/^accessToken=[\S\s]+/)
})