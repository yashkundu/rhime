import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'



it('Successfully signed out', async () => {
    const response = await request(app)
    .post('/api/auth/signout')
    .expect(StatusCodes.OK)

    
})