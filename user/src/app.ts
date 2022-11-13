import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import 'express-async-errors'


import cookieParser from 'cookie-parser'

import pino from 'pino-http'
import { pinoOptions, ErrorHandler, NotFoundMware, userAuthMware } from '@rhime/common'


import { profileRouter } from './routes/profileRouter'



const app = express()


app.use(pino(pinoOptions('fatal', false, false)))
app.use(cookieParser(process.env.SIGNED_COOKIE_SECRET))
app.use(express.json())
app.use(userAuthMware)


app.use('/api/user/:userId/profile', profileRouter)



app.use(NotFoundMware)
app.use(ErrorHandler)



export {app}