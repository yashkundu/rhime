import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import 'express-async-errors';

import cookieParser from 'cookie-parser'
import pino from 'pino-http'

import {NotFoundMware, ErrorHandler, pinoOptions} from '@rhime/common';

import { proxyMware } from './middlewares/proxyMware';
import { gatewayAuthenticator } from './middlewares/gatewayAuthenticator';

const app = express();

app.use(pino(pinoOptions('info', false, false)))
app.use(cookieParser(process.env.SIGNED_COOKIE_SECRET))
app.use(gatewayAuthenticator)


app.use(proxyMware)



app.use(NotFoundMware);
app.use(ErrorHandler);


export {app}