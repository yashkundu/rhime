import { Express, Request, Response, NextFunction } from "express";
import pino from 'pino-http'

import chalk from 'chalk'
import moment from 'moment';

const logger = pino()

import {pinoOptions} from '@rhime/common'

const proxyLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log(
        chalk.cyanBright(`[${moment(Date.now()).format('LTS')}]`), 
        ' - ', 
        chalk.yellowBright(req.method),
        '  ',
        chalk.redBright(req.url))
    console.log('{');
    for(const [key, value] of Object.entries(req.headers)) {
        console.log('  ', chalk.whiteBright(key), ': ', chalk.greenBright(value));
    }
    console.log('  ', chalk.whiteBright('body'), ': ', chalk.greenBright(JSON.stringify(req.body, null, 2)));
    console.log('  ', chalk.whiteBright('params'), ': ', chalk.greenBright(JSON.stringify(req.params, null, 2)));
    console.log('}');
    
    next()
}



const setUpLogging = (app: Express) => {
    app.use(pino(pinoOptions('info', true, true)), proxyLogger)
}

export {setUpLogging}