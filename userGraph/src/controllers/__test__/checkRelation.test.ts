import request from 'supertest'
import { app } from '../../app'
import { StatusCodes } from 'http-status-codes'
import {createUsers} from '../../test/utils/specificUtils'


it('checking the relations by testing various toggle operatoins randomly', async () => {
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

    for(const [x1, x2] of followPairs){
        map[x1][x2] = !map[x1][x2]
    }

    for(let i=0;i<20;i++){
        for(let j=0;j<20;j++){
            if(i===j) continue;
            let res = await request(app)
            .get(`/api/userGraph/${info.users[j]._id}/isMessiah`)
            .set('Cookie', info.cookies[i])
            .expect(StatusCodes.OK)
            expect(res.body.isMessiah).toEqual(map[i][j])

            res = await request(app)
            .get(`/api/userGraph/${info.users[j]._id}/isMinion`)
            .set('Cookie', info.cookies[i])
            .expect(StatusCodes.OK)
            expect(res.body.isMinion).toEqual(map[j][i])

        }
    }

})
