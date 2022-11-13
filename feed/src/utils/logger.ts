import * as fs from 'fs'
import * as util from 'util'

const ws = fs.createWriteStream('./data.log')

export const logF = (...data: any) => {
    const len = data.length
    for(let i=0;i<len;i++){
        ws.write(util.inspect(data[i]))
        ws.write(' ')
    }
    ws.write('\n')
}

process.on('exit', () => {
    ws.end()
})