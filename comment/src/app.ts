import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import 'express-async-errors'


import cookieParser from 'cookie-parser'

import pino from 'pino-http'
import { pinoOptions, ErrorHandler, NotFoundMware, userAuthMware } from '@rhime/common'

import { commentRouter } from './routes/commentRouter'

const app = express()

app.use(pino(pinoOptions('info', false, false)))
app.use(express.json())
app.use(userAuthMware)              // populates req.userAuth


app.use('/api/comment', commentRouter)



app.use(NotFoundMware)
app.use(ErrorHandler)



export {app}