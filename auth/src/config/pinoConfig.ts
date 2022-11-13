import { Request, Response } from "express"

export const pinoOptions = {
    name: 'albert',
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'h:MM TT',
        }
    },
    serializers: {
        // req (req: Request) {
        //     return {
        //         id: req.id,
        //         method: req.method,
        //         url: req.url,
        //     }
        // },
        // res (res: Response) {
        //     return {
        //         statusCode: res.statusCode,
        //     }
        // }
    }
}