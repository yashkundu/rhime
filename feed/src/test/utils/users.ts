import * as crypto from 'crypto'
import {logF} from '../../utils/logger'

class User {
    users: string[];

    constructor(){
        this.users = []
        for(let i=0;i<202;i++)
            this.users.push(crypto.randomBytes(12).toString('hex'))
    }

}



export const user = new User()

logF('Users ----------------------------------------------------------- ')
for(let i=1;i<=200;i++){
    logF(i, ' => ', user.users[i])
}
logF()