import request from 'supertest'
import { app } from '../../app'
import {StatusCodes} from 'http-status-codes'
import {createUsers} from '../../test/utils/specificUtils'

it('successfully getting the post', async () => {
    const info = await createUsers(1)

    const post = await request(app)
    .post(`/api/post`)
    .send({caption: 'someRandomCaption'})
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    const res = await request(app)
    .get(`/api/post/${post.body.post._id}`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    expect(res.body.post.caption).toEqual('someRandomCaption')
})