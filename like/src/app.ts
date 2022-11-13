import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import 'express-async-errors'


import pino from 'pino-http'
import { pinoOptions, ErrorHandler, NotFoundMware, userAuthMware } from '@rhime/common'

import { itemLikeRouter } from './routes/itemLikeRouter'

const app = express()

app.use(pino(pinoOptions('info', false, false)))
app.use(express.json())
app.use(userAuthMware)              // populates req.userAuth

app.use('/api/like', itemLikeRouter)


app.use(NotFoundMware)
app.use(ErrorHandler)



export {app}