import 'module-alias/register'
import express, { ErrorRequestHandler } from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotEnv from 'dotenv'
dotEnv.config()

import rateLimitConfig from './config/rateLimit'
import { Server } from 'socket.io'
import './data/db'
import routes from './routes'

import corsConfig from './config/cors'
import { PORT } from './common/privateKeys'

import http from 'http'
import { connectSocket } from './services/socket/connect.socket'

const app = express()
const rateLimiter = rateLimit(rateLimitConfig)

app.set('trust proxy', rateLimitConfig.numberOfProxies)
app.use('/api', rateLimiter)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
)

/*
 * Cors is enabled so the client can acces enpoint on this API wthout having to make request *
 *  from the same Origin
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsConfig.origins)
  res.header('Access-Control-Allow-Headers', corsConfig.headers)
  if (req.method === 'OPTIONS') {
    // preflight request
    res.header('Access-Control-Allow-Methods', corsConfig.methods)
    return res.status(200).json({})
  }
  next()
  return true
})

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development

  res.locals.message = err.message || 'Something went wrong';
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status).json({
    error: true,
    message: err.message || 'Something went wrong',
  })
  next()
}
app.use(errorHandler)

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connect', connectSocket)
// @ts-ignore;
global.io = io

app.use('/api/v0.1', routes)

// catch 404 and forward to error handler
app.use((_, res) =>
  res.status(404).json({
    error: true,
    message: 'you seem to be lost',
  })
)

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
