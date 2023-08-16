import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import config from './config';
import AppError from './util/error';
import errorHandler from './util/errorController';
import { initializeDB } from './models/data';
import quotaRouter from './api/getQuote/quote.route';
import uploadRouter from './api/upload/upload.route';
import getStatusRouter from './api/getStatus/getStatus.route';
import tasks from './rate.schedulerRegister';
import getLinkRouter from './api/getLink/getLink.route';
import historyRouter from './api/getHistory/history.route';

export const app = express();

app.disable('x-powered-by');

app.use(cors());

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(morgan('dev'));

app.use('/getQuote', quotaRouter);
app.use('/upload', uploadRouter);
app.use('/getStatus', getStatusRouter);
app.use('/getLink', getLinkRouter);
app.use('/getHistory', historyRouter);

app.use(errorHandler);

app.use((req, res, next) => {
  const err = new AppError(
    `${req.ip} tried to reach a resource at ${req.originalUrl} that is not on this server.`,
    404
  );
  next(err);
});

app.use('/', (req, res) => {
  res.status(404).end();
});

export const start = async () => {
  try {
    await initializeDB();
    tasks.start();
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/`);
    });
  } catch (e) {
    console.error('here is the error: ', e);
  }
};
