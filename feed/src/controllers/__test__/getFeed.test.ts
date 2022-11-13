import request from 'supertest'
import {StatusCodes} from 'http-status-codes'
import {app} from '../../app'
import {makePosts} from '../../test/utils/specificUtils'
import {UserGraphView} from '../../services/userGraphView'
import {post} from '../../test/utils/posts'
import { user } from '../../test/utils/users'
import { getCookie } from '../../test/utils/jwt'


it('unauthenticated request', async () => {
    request(app)
    .get('/api/feed')
    .expect(StatusCodes.UNAUTHORIZED)
})


it('complex request for getFeed', async () => {
    await makePosts()

    const posts: number[][] = []
    for(let i=0;i<=200;i++) posts.push([])

    for(let i=1;i<=500;i++){
        posts[post.posts[i]].push(i)
    }

    const feed: number[][] = []
    for(let i=0;i<=200;i++) feed.push([])

    for(let i=1;i<=200;i++){
        for(const num of posts[i])
            feed[i].push(num);
        for(const x of UserGraphView.messiahs[i]){
            for(const num of posts[x])
                feed[i].push(num);
        }
    }

    for(let i=1;i<=200;i++) feed[i].sort((a, b) => (b-a))


    const getUserFeed = async (ind: number) => {
        let anchorId = undefined
        let docs: string[] = []
        const cookie = getCookie({userId: user.users[ind], userName: 'someRand'})
        while(true) {
            const posts:any = await request(app)
            .get(`/api/feed${(anchorId)?`?anchorId=${anchorId}`:''}`)
            .set('Cookie', cookie)
            .expect(StatusCodes.OK)

            if(posts.body.posts.length===0) break;
            docs = docs.concat(posts.body.posts)

            anchorId = posts.body.posts[posts.body.posts.length-1]
        }
        return docs
    }

    const verifyUserFeed = async (ind: number) => {
        const docs = await getUserFeed(ind)
        const list = feed[ind]
        
        if(docs.length!==list.length) return false;
        for(let i=0;i<docs.length;i++) if(docs[i]!==String(list[i])) return false;
        return true;
    }

    const promises: Promise<boolean>[] = []
    for(let i=1;i<=200;i++){
        promises.push(verifyUserFeed(i));
    }

    const res = await Promise.all(promises)
    for(let i=0;i<200;i++) expect(res[i]).toEqual(true)
})