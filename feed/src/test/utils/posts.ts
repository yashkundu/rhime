import {logF} from '../../utils/logger'
import {user} from './users'

class Post{
    posts: number[];
    constructor(){
        this.posts = []
        for(let i=0;i<=500;i++) 
            this.posts[i] = 1 + Math.floor(Math.random()*200)
    }
}


export const post = new Post()

logF('Posts ----------------------------------------------------------- ')
for(let i=1;i<=500;i++){
    logF(i, ' => ', post.posts[i], ' => ', user.users[post.posts[i]])
}
logF()