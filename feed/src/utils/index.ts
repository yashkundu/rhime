import {ObjectId, Long} from 'bson'
import { ProfileFeed } from '../db/collections/profileFeedCollection'
import { PAGE_SIZE } from '../config'
import { UserGraphView } from '../services/userGraphView'
import { Messiahs } from '../interfaces/messiahsInterface'


const getUserPosts = async (userId: ObjectId, anchorId: string | undefined) => {
    const matchObj: {[key: string]: any} = {}
    matchObj['_id.userId'] = userId
    if(anchorId) matchObj['_id.postId'] = {$lt: new Long(anchorId)}
    
    const cursor = ProfileFeed.find(matchObj).sort({'_id.postId': -1}).limit(PAGE_SIZE)
    const docs = await cursor.toArray()
    const posts = docs.map(doc => (doc._id.postId.toString()))
    return posts
}


const getTimelinePosts = async (userId: ObjectId, anchorId: string | undefined) => {
    
    const matchObj: {[key: string]: any} = {}
    if(anchorId) matchObj['_id.postId'] = {$lt: new Long(anchorId)}
    let posts: string[] = []

    const call = UserGraphView.getMessiahs({userId: userId.toHexString()})

    let messiahs: Messiahs;

    call.on('error', function(err: Error) {
        console.log('Error in getting messiahs :(');
        console.log(err);
    })

    call.on('status', function(status: any) {
        console.log('Status of getMessiahs : ', status);
    });

    call.on('end', function() {
        console.log('getMessiahs stream has ended');
    });

    while(messiahs = call.read()){
        const userIds = messiahs.userIds.map(bufId => new ObjectId(bufId))
        
        const cursor = ProfileFeed.aggregate([
            {
                $match: {'_id.userId': {$in: userIds}, ...matchObj}
            },
            {
                $sort: {'_id.postId': -1}
            },
            {
                $limit: PAGE_SIZE
            }
        ])

        const newPosts = (await cursor.toArray()).map(doc => doc._id.postId.toString()) as string[]
        posts = getTopX(posts.concat(newPosts))
    }
    const docs = await ProfileFeed.find({'_id.userId': userId, ...matchObj})
        .sort({'_id.postId': -1})
        .limit(PAGE_SIZE)
        .toArray()

    const newPosts = docs.map((doc) => doc._id.postId.toString())
    
    
    posts = getTopX(posts.concat(newPosts))
    return posts;  
    
          
}

const getTopX = (posts: string[]) => {
    return posts.sort().reverse().slice(0, PAGE_SIZE)
}


export {getUserPosts, getTimelinePosts}