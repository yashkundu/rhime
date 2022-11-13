import {user} from '../../test/utils/users'
import {post} from '../../test/utils/posts'
import {CACHE_LIMIT} from '../../config'
import {UserGraphView} from '../../services/userGraphView'
import {makePosts} from '../../test/utils/specificUtils'
import {ds} from '../../ds/redis'

it('complex test for fanOut', async () => {
    
    await makePosts()
    
    for(let i=1;i<=200;i++){
        const userId = user.users[i]

        const posts = await ds.redis.zrevrange(`user:${userId}`, 0, -1);

        
        expect(posts.length).toBeLessThanOrEqual(CACHE_LIMIT)
    

        posts.forEach(p => {
            const postId = Number(p)
            const thatUser = post.posts[postId]

            const bool = (user.users[thatUser]===userId) || (UserGraphView.minions[thatUser].has(i))

            if(!bool) {
                console.log('i -- ', i);
                console.log('postId -- ', postId);
                console.log('ownerUser -- ', thatUser);
                console.log('ownerUserId -- ', user.users[thatUser])

                console.log('userId -- ', userId)
            }
            expect(bool).toEqual(true)
        })
    }

})