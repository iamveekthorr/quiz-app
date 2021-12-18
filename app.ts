import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitizer from 'express-mongo-sanitize';
import xxs from 'xss-clean';
import AppError from './utils/appError';


import userRouter from './routes/userRoutes'

const app: Application = express();

app.use(cors());
app.use(helmet());

app.use(cookieParser());
app.use(mongoSanitizer());

// Data Sanitization against XSS
app.use(xxs());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//  Reading data from the body into req.body. The limit option manages how large the data can be
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Test Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/auth/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;
