import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import 'express-async-errors'



import pino from 'pino-http'
import { pinoOptions, ErrorHandler, NotFoundMware, userAuthMware } from '@rhime/common'

import {feedRouter} from './routes/feedRouter'


const app = express()


app.use(pino(pinoOptions('error', false, false)))
app.use(express.json())
app.use(userAuthMware)


app.use('/api/feed', feedRouter)



app.use(NotFoundMware)
app.use(ErrorHandler)



export {app}