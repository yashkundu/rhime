import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'
import {createUsers} from '../../test/utils/specificUtils'
import { ObjectId } from 'bson'



it('unauthenticated error', async () => {
    await request(app)
    .post(`/api/userGraph/${new ObjectId()}/toggleUser`)
    .expect(StatusCodes.UNAUTHORIZED)
})

it('Bad userId in the url params', async () => {
    const info = await createUsers(1)

    await request(app)
    .post(`/api/userGraph/oih45hhiuph/toggleUser`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.BAD_REQUEST)
})


it('The user is toggling itself', async () => {
    const info = await createUsers(1)

    await request(app)
    .post(`/api/userGraph/${info.users[0]._id}/toggleUser`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.FORBIDDEN)
})


it('Toggling a non existing user', async () => {
    const info = await createUsers(1)

    await request(app)
    .post(`/api/userGraph/${new ObjectId()}/toggleUser`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.NOT_FOUND)
})


it('simple test for follownig and unfollowing a user', async () => {
    // creating two random users
    const info = await createUsers(2)

    // user1 follows user2 so count increases bot minion and messiah
    let res = await request(app)
    .post(`/api/userGraph/${info.users[1]._id}/toggleUser`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    expect(res.body.isFollowing).toEqual(true)

    res = await request(app)
    .get(`/api/userGraph/${info.users[0]._id}/messiahCount`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)
    expect(res.body.messiahCount).toEqual(1)

    res = await request(app)
    .get(`/api/userGraph/${info.users[1]._id}/minionCount`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)
    expect(res.body.minionCount).toEqual(1)


    // user1 unfollows user2 so count decreases again
    res = await request(app)
    .post(`/api/userGraph/${info.users[1]._id}/toggleUser`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)

    expect(res.body.isFollowing).toEqual(false)

    res = await request(app)
    .get(`/api/userGraph/${info.users[0]._id}/messiahCount`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)
    expect(res.body.messiahCount).toEqual(0)

    res = await request(app)
    .get(`/api/userGraph/${info.users[1]._id}/minionCount`)
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.OK)
    expect(res.body.minionCount).toEqual(0)
})


it('complex test for following and unfollowing a user', async () => {
    const info = await createUsers(20);
    const followPairs = []
    const promises = []

    for(let i=0;i<60;i++){
        const x1 = Math.floor(Math.random()*20)
        const x2 = Math.floor(Math.random()*20)
        if(x1!==x2) followPairs.push([x1, x2])
    }

    for(const [x1, x2] of followPairs){
        promises.push(
            request(app)
            .post(`/api/userGraph/${info.users[x2]._id}/toggleUser`)
            .set('Cookie', info.cookies[x1])
            .expect(StatusCodes.OK)
        )
    }

    await Promise.all(promises)

    const map: boolean[][] = []
    for(let i=0;i<20;i++){
        map.push([])
        for(let j=0;j<20;j++){
            map[i].push(false)
        }
    }

    const ans: number[][] = []
    for(let i=0;i<20;i++){
        ans.push([])
        ans[i].push(0)
        ans[i].push(0)
    }

    for(const [x1, x2] of followPairs){
        if(map[x1][x2]){
            ans[x1][1]--;
            ans[x2][0]--;
        } else{
            ans[x1][1]++;
            ans[x2][0]++;
        }
        map[x1][x2] = !map[x1][x2]
    }

    for(let i=0;i<20;i++){
        let res = await request(app)
        .get(`/api/userGraph/${info.users[i]._id}/minionCount`)
        .set('Cookie', info.cookies[i])
        .expect(StatusCodes.OK)
        
        expect(res.body.minionCount).toEqual(ans[i][0])

        res = await request(app)
        .get(`/api/userGraph/${info.users[i]._id}/messiahCount`)
        .set('Cookie', info.cookies[i])
        .expect(StatusCodes.OK)


        expect(res.body.messiahCount).toEqual(ans[i][1])
    }

})




// it('testing the transaction if it will rollback if a failure occurs', async () => {

// })
