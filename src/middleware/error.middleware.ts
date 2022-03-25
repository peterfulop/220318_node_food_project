import { Request, Response, NextFunction } from 'express';
import HttpExceptions from '../exceptions/http.exception';
import ErrorObject from '../utils/interfaces/error.interface';

const setErrorDetails = (error: HttpExceptions): ErrorObject => {
  let errorMessage: string = 'Internal server error';
  let statusCode: number = 500;
  if (error.message.includes('11000')) {
    const value = error.message.match(/(["'])(\\?.)*?\1/);
    if (value) errorMessage = `Duplicate field value: ${value[0]}. Please use another value!`;
    statusCode = 400;
  } else if (error.name === 'JsonWebTokenError' || error.message === 'notoken') {
    errorMessage = 'You are not logged in!';
    statusCode = 401;
  } else if (error.message === 'loginerror') {
    errorMessage = 'invalid login credential';
    statusCode = 401;
  } else if (error.message === 'nouser') {
    errorMessage = 'The user no longer exists';
    statusCode = 401;
  } else if (error.name === 'TokenExpiredError') {
    errorMessage = 'Expired token. You must be logged in!';
    statusCode = 401;
  } else if (error.message.includes('Cast to ObjectId failed') || error.message === 'nodata') {
    errorMessage = 'not found';
    statusCode = 404;
  }
  return { errorMessage, statusCode };
};

const ErrorMiddleware = (err: HttpExceptions, req: Request, res: Response, next: NextFunction): void => {
  const errorObj: ErrorObject = setErrorDetails(err);
  res.status(errorObj.statusCode).send({
    error: errorObj.errorMessage,
    statusCode: errorObj.statusCode,
  });
};

export default ErrorMiddleware;
