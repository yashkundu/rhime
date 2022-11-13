import request from 'supertest'
import { app } from '../../app'
import {StatusCodes} from 'http-status-codes'
import {createUsers} from '../../test/utils/specificUtils'


it('unauthenticated post creation', async () => {
    await request(app)
    .post('/api/post')
    .send({caption: 'alkdhfphaoidhup'})
    .expect(StatusCodes.UNAUTHORIZED)
})

it('invalid data for post creation', async () => {
    const info = await createUsers(1)

    await request(app)
    .post('/api/post')
    .send({caption: 'alkdhfphaoidalkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.BAD_REQUEST)
})


it('creating a valid post', async () => {
    const info = await createUsers(1)

    await request(app)
    .post('/api/post')
    .send({caption: 'alkdhfphaoidalkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.BAD_REQUEST)
})

