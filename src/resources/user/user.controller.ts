import { NextFunction, Request, Response, Router } from 'express';
import HttpExceptions from '../../exceptions/http.exception';
import validationMiddleware from '../../middleware/validation.middleware';
import Controller from '../../utils/interfaces/controller.interface';
import { UserCreateOptions, UserUpdateOptions } from './user.interface';
import UserService from './user.service';
import validation from './user.validation';
import { createSendToken } from '../../utils/token';
import { protect } from '../../middleware/protect.middleware';
import { STATUS_CODES } from 'http';

class UserController implements Controller {
  path = '/user';
  router = Router();
  userService = new UserService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(`${this.path}/signup`, validationMiddleware(validation.create), this.signup);
    this.router.post(`${this.path}/login`, validationMiddleware(validation.login), this.login);
    this.router.get(`${this.path}/logout`, protect, this.logout);

    // not necessary routes, User update methods are much more specific than this.
    this.router.get(`${this.path}`, protect, this.getAll);
    this.router.get(`${this.path}/:id`, protect, this.getOne);
    this.router.put(`${this.path}/:id`, protect, validationMiddleware(validation.update), this.update);
    this.router.delete(`${this.path}/:id`, protect, this.delete);
  }

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({
          status: 'Please provide email and password!',
        });
      }
      const user = await this.userService.login(username, password);
      if (!user) throw Error('loginerror');
      createSendToken(user._id, 200, res);
    } catch (error: any) {
      next(new HttpExceptions(500, error.message));
    }
  };

  private signup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { username, email, password, confirmPassword } = req.body as UserCreateOptions;
      const data = await this.userService.signup({ username, email, password, confirmPassword });
      const userId = data._id as string;
      createSendToken(userId, 200, res);
    } catch (error: any) {
      next(new HttpExceptions(500, error.message));
    }
  };

  private logout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
      });
      res.status(200).json({
        status: 'You logged out!',
        statusCode: res.statusCode,
      });
    } catch (error: any) {
      next(new HttpExceptions(500, error.message));
    }
  };

  private getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const data = await this.userService.getUsers();
      res.status(200).json({
        status: 'success',
        statusCode: res.statusCode,
        results: data.length,
        data,
      });
    } catch (error: any) {
      next(new HttpExceptions(500, error.message));
    }
  };

  private getOne = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.userService.getUser(id);
      if (!data) throw Error('nodata');
      res.status(200).json({
        status: 'success',
        statusCode: res.statusCode,
        data,
      });
    } catch (error: any) {
      next(new HttpExceptions(500, error.message));
    }
  };

  private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params as { id: string };
      const { username, email } = req.body as UserUpdateOptions;
      const data = await this.userService.updateUser(id, { username, email });
      if (!data) throw Error('nodata');
      res.status(200).json({
        status: 'success',
        statusCode: res.statusCode,
        data,
      });
    } catch (error: any) {
      next(new HttpExceptions(400, error.message));
    }
  };

  private delete = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params as { id: string };
      await this.userService.deleteUser(id);
      res.status(204).json({
        status: 'success',
        statusCode: res.statusCode,
        message: 'Document has been deleted',
      });
    } catch (error: any) {
      next(new HttpExceptions(400, error.message));
    }
  };
}

export default UserController;
