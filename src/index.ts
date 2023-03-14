import express, { ErrorRequestHandler } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotEnv from 'dotenv';
dotEnv.config();

import rateLimitConfig from './config/rateLimit';

import './data/db';

import corsConfig from './config/cors';
import { PORT } from './common/privateKeys';

const app = express();
const rateLimiter = rateLimit(rateLimitConfig);

app.set('trust proxy', rateLimitConfig.numberOfProxies);
app.use('/api', rateLimiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);

/*                                                                                        *
 * Cors is enabled so the client can acces enpoint on this API wthout having to make request *
 *  from the same Origin
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', corsConfig.origins);
  res.header('Access-Control-Allow-Headers', corsConfig.headers);
  if (req.method === 'OPTIONS') {
    // preflight request
    res.header('Access-Control-Allow-Methods', corsConfig.methods);
    return res.status(200).json({});
  }
  next();
  return true;
});

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next();
};
app.use(errorHandler);

app.get('/api/v0.1', (_, res) => {
  res.status(200).send()
});

// catch 404 and forward to error handler
app.use((req, res) => res.status(404).json({
  error: true,
  msg: 'you seem to be lost',
}));

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
