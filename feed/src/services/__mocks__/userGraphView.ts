import {ObjectId} from 'bson'
import {user} from '../../test/utils/users'
import * as stream from 'stream'
import {logF} from '../../utils/logger'


/*
follower relation
1 -> [2, 4, 5, 8, 13, 17, 19]

*/

class MockedView{
    minions:Set<Number>[];
    messiahs: Set<Number>[];

    constructor(){
        this.minions = []
        for(let i=0;i<=200;i++) this.minions.push(new Set())

        for(let i=1;i<=200;i++) {
            const num = Math.floor(Math.random()*100)

            for(let k=0;k<num;k++){
                let rand;
                while((rand=1+Math.floor(Math.random()*200))===i);
                this.minions[i].add(rand)
            }
        }

        this.messiahs = []
        for(let i=0;i<=200;i++) this.messiahs.push(new Set())

        for(let i=1;i<=200;i++) {
            for(const x of this.minions[i]) {
                this.messiahs[Number(x)].add(i)
            }
        }

    }

    getMinions({userId}:{userId: string}){
        let i;
        for(i=1;i<=200;i++) if(user.users[i]===userId) break;
        const ids = this.minions[i];

        const iter = ids[Symbol.iterator]()

        const rs = new stream.Readable({
            objectMode: true,
            highWaterMark: 1,
            read(size){
                const ids: Buffer[] = []
                const sz = Math.floor(Math.random()*30) + 1
                for(let i=0;i<sz;i++){
                    const next = iter.next()

                    if(!next.value){
                        this.push({userIds: ids})
                        this.push(null)
                        return
                    }
                    
                    ids.push(Buffer.from(user.users[next.value], 'hex'))
                    
                }
                this.push({userIds: ids})
            }
        })

        return rs
    }

    getMessiahs({userId}:{userId: string}){
        let i;
        for(i=1;i<=200;i++) if(user.users[i]===userId) break;
        const ids = this.messiahs[i];

        const iter = ids[Symbol.iterator]()

        const rs = new stream.Readable({
            objectMode: true,
            highWaterMark: 1,
            read(size){
                const ids: Buffer[] = []
                const sz = Math.floor(Math.random()*30) + 1
                for(let i=0;i<sz;i++){
                    const next = iter.next()

                    if(!next.value){
                        this.push({userIds: ids})
                        this.push(null)
                        return
                    }
                    
                    ids.push(Buffer.from(user.users[next.value], 'hex'))
                    
                }
                this.push({userIds: ids})
            }
        })

        return rs
    }

}


export const UserGraphView = new MockedView()


logF('Minions ------------------------------------------------------------------ ')
for(let i=1;i<=200;i++){
    logF(i, ' => ', UserGraphView.minions[i])
}
logF()

logF('Messiahs ------------------------------------------------------------------ ')
for(let i=1;i<=200;i++){
    logF(i, ' => ', UserGraphView.messiahs[i])
}
logF()