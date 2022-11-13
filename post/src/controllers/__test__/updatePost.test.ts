import request from 'supertest'
import { app } from '../../app'
import {StatusCodes} from 'http-status-codes'
import {createUsers} from '../../test/utils/specificUtils'
import { ObjectId } from 'bson'



it('unauthenticated post updation', async () => {
    await request(app)
    .patch('/api/post/dfghsdgh')
    .send({caption: 'alkdhfphaoidhup'})
    .expect(StatusCodes.UNAUTHORIZED)
})

it('invalid post id updation', async () => {
    const info = await createUsers(1)

    await request(app)
    .patch('/api/post/fjnfghn')
    .send({caption: 'alkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.BAD_REQUEST)
})

it('post id not found', async () => {
    const info = await createUsers(1)

    await request(app)
    .patch(`/api/post/${new ObjectId()}`)
    .send({caption: 'alkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.NOT_FOUND)
})

it('Unauthorized access to post', async () => {
    const info = await createUsers(2)

    const res = await request(app)
    .post(`/api/post`)
    .send({caption: 'alkdhfphaoidhup'})
    .set('Cookie', info.cookies[1])
    .expect(StatusCodes.OK)

    await request(app)
    .patch(`/api/post/${res.body.post._id}`)
    .send({caption: 'alkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.UNAUTHORIZED)
})

it('invalid data for post updation', async () => {
    const info = await createUsers(1)

    const res = await request(app)
    .post(`/api/post`)
    .send({caption: 'alkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)


    await request(app)
    .patch(`/api/post/${res.body.post._id}`)
    .send({caption: 'alkdhfphaodggdfidalkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.BAD_REQUEST)
})


it('successfull updation of post', async () => {
    const info = await createUsers(1)

    const post = await request(app)
    .post(`/api/post`)
    .send({caption: 'alkdhfphaoidhup'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    let res = await request(app)
    .patch(`/api/post/${post.body.post._id}`)
    .send({caption: 'newCaption'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    res = await request(app)
    .get(`/api/post/${post.body.post._id}`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    expect(res.body.post.caption).toEqual('newCaption')
})

