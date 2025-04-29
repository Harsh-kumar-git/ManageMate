import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import mongoose from 'mongoose';

interface ErrorResponse {
  status: 'error' | 'fail';
  message: string;
  errors?: any;
  stack?: string;
}

const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};

const handleJWTError = () => {
  return new AppError(401, 'Invalid token. Please log in again!');
};

const handleJWTExpiredError = () => {
  return new AppError(401, 'Your token has expired! Please log in again.');
};

const sendErrorDev = (err: AppError, res: Response) => {
  const errorResponse: ErrorResponse = {
    status: 'error',
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  };

  res.status(err.statusCode || 500).json(errorResponse);
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      status: 'fail',
      message: err.message,
      errors: err.errors,
    };

    return res.status(err.statusCode).json(errorResponse);
  }
  
  // Programming or other unknown error: don't leak error details
  console.error('ERROR ', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  console.error('Stack:', err.stack);

  let error = err;
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  if ((err as any).code === 11000) error = handleDuplicateFieldsDB(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode < 500 ? 'fail' : 'error',
      message: err.message,
      errors: err.errors,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    return;
  }

  // Fallback for unknown errors
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
