import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'
import {createUsers} from '../../test/utils/specificUtils'
import { Minion } from '../../db/collections/minionCollection'
import {ObjectId} from 'bson'

it('unauthenticated access', async () => {
    await request(app)
    .get(`/api/userGraph/${new ObjectId}/minions`)
    .expect(StatusCodes.UNAUTHORIZED)
})

it('verifying the minions list attributes', async () => {
    const info = await createUsers(2)

    let res = await request(app)
    .post(`/api/userGraph/${info.users[1]._id}/toggleUser`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    expect(res.body.isFollowing).toEqual(true)

    res = await request(app)
    .get(`/api/userGraph/${info.users[0]._id}/isMinion`)
    .set('Cookie', info.cookies[1])
    .expect(StatusCodes.OK)

    expect(res.body.isMinion).toEqual(true)

    res = await request(app)
    .get(`/api/userGraph/${info.users[1]._id}/minions/jhhj45`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    

    expect(res.body.length).toEqual(1)

    expect(res.body[0].minionId).toEqual(info.users[0]._id!.toHexString())
})



it('testing the paginated minions list', async () => {

    await Minion.createIndex({messiahId: 1, minionId: 1})

    const info = await createUsers(98)
    const promises = []

    for(let i=1;i<98;i++){
        promises.push(
            request(app)
            .post(`/api/userGraph/${info.users[0]._id}/toggleUser`)
            .set('Cookie', info.cookies[i])
            .expect(StatusCodes.OK)
        )
    }

    await Promise.all(promises)

    let lastMinionId = 'adwfs45'

    const getMinions = async (lastMinionId: string) => {
        const res = await request(app)
        .get(`/api/userGraph/${info.users[0]._id}/minions/${lastMinionId}`)
        .set('Cookie', info.cookies[0])
        .expect(StatusCodes.OK)
        return res.body
    }

    let res = await getMinions(lastMinionId)
    expect(res.length).toEqual(20)

    
    
    lastMinionId = res[19].minionId
    res = await getMinions(lastMinionId)
    expect(res.length).toEqual(20)

    lastMinionId = res[19].minionId
    res = await getMinions(lastMinionId)
    expect(res.length).toEqual(20)

    lastMinionId = res[19].minionId
    res = await getMinions(lastMinionId)
    expect(res.length).toEqual(20)

    lastMinionId = res[19].minionId
    res = await getMinions(lastMinionId)
    expect(res.length).toEqual(17)

    lastMinionId = res[16].minionId
    res = await getMinions(lastMinionId)
    expect(res.length).toEqual(0)
    

})