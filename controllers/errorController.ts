import { NextFunction } from 'express';
import { CastError, Error } from 'mongoose';
import { MongoError } from 'mongodb';

import AppError from '../utils/appError';

const handleJwtError = (): AppError => {
  return new AppError('Invalid token please try again', 401);
};

const handleCastErrorDB = (err: Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired. Please login again', 401);
};

const handleDuplicateFieldsDB = (err: MongoError): AppError => {
  const message = `${err.code}: ${
    Object.values(err.errorLabels)[0]
  } already exists. Please use a different ${Object.keys(err.errorLabels)[0]}`;

  return new AppError(message, 409);
};

const handleValidationErrorDB = (err: Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  //For API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  console.error(`[errorController.js] (line 40) - ${err.message}`);
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error(`[errorController.js] (line 54) - ${err.message}`);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error(`[errorController.js] (line 65) - ${err.message}`);
};

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  //
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    error.message = err.message;

    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'CastError')
      error = handleCastErrorDB(error as CastError);
    if (error.name === 'MongoError' && (error as MongoError).code === 11000)
      error = handleDuplicateFieldsDB(error as MongoError);
    if (error.message.includes('validation failed'))
      error = handleValidationErrorDB(error as Error.ValidationError);
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
