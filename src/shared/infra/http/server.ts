import 'reflect-metadata';
import 'dotenv/config';

import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';
import AppError from '@shared/errors/AppError';

import routes from './routes';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes)
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Server running on PORT ${port}!`);
});