import { NextFunction, Request, Response } from 'express';
import User from '../resources/user/user.model';
import { verifyToken } from '../utils/token';
import ErrorMiddleware from './error.middleware';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new Error('notoken');
    }
    const decoded = await verifyToken(token);
    const activeUser = await User.findById(Object(decoded).id);
    if (!activeUser) {
      throw new Error('nouser');
    }
    req.user = activeUser;
    res.locals.user = activeUser;
    next();
  } catch (error: any) {
    ErrorMiddleware(error, req, res, next);
  }
};
