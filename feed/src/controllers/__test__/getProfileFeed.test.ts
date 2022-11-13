import request from 'supertest'
import {app} from '../../app'
import {StatusCodes} from 'http-status-codes'
import {createUsers, makePosts} from '../../test/utils/specificUtils'
import {user} from '../../test/utils/users'
import {post} from '../../test/utils/posts'

it('unauthenticated request', async () => {
    request(app)
    .get('/api/feed/dsfg')
    .expect(StatusCodes.UNAUTHORIZED)
})

it('bad userId', async () => {
    const info = createUsers(1)

    request(app)
    .get('/api/feed/dsfg')
    .set('Cookie', info.cookies[0])
    .expect(StatusCodes.BAD_REQUEST)
})


it('complex test for getProfileFeed', async () => {
    const info = createUsers(1)

    await makePosts()

    const posts: number[][] = []
    for(let i=0;i<=200;i++) posts.push([])

    for(let i=1;i<=500;i++){
        posts[post.posts[i]].push(i)
    }

    for(let i=1;i<=200;i++){
        posts[i].sort((a, b) => (b-a))
    }

    const getUserPosts = async (ind: number) => {
        let anchorId = undefined
        let docs: string[] = []
        while(true) {
            const posts: any = await request(app)
            .get(`/api/feed/${user.users[ind]}${(anchorId)?`?anchorId=${anchorId}`:''}`)
            .set('Cookie', info.cookies[0])
            .expect(StatusCodes.OK)

            if(posts.body.posts.length===0) break;
            docs = docs.concat(posts.body.posts)

            anchorId = posts.body.posts[posts.body.posts.length-1]
        }
        return docs
    }

    const verifyUserPosts = async (ind: number) => {
        const docs = await getUserPosts(ind)
        const list = posts[ind]
        
        if(docs.length!==list.length) return false;
        for(let i=0;i<docs.length;i++) if(docs[i]!==String(list[i])) return false;
        return true;
    }

    const promises: Promise<boolean>[] = []
    for(let i=1;i<=200;i++){
       promises.push(verifyUserPosts(i))
    }

    const res = await Promise.all(promises)
    for(let i=0;i<200;i++) expect(res[i]).toEqual(true)
    
})