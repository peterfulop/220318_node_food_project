import express, { Application, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import Controller from './utils/interfaces/controller.interface';
import ErrorMiddleware from './middleware/error.middleware';
import importDefaultData from './utils/import.base';
import fs from 'fs';
import { Server } from 'http';

class App {
  public express: Application;
  public port: number;
  public server: Server | undefined;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port | 3000;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(cookieParser());
    this.express.use(express.urlencoded({ extended: false }));
    var accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
    this.express.use(morgan('common', { stream: accessLogStream }));
    this.express.use(morgan('dev'));
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use(process.env.API_URL as string, controller.router);
    });
    this.routeErrorHandling();
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private async initialiseDatabaseConnection() {
    const DB = String(process.env.MONGO_PATH)
      .replace('<USERNAME>', String(process.env.MONGO_USER))
      .replace('<PASSWORD>', String(process.env.MONGO_PASSWORD));
    mongoose
      .connect(DB)
      .then(() => {
        console.log('Online DB connection successful!');
      })
      .catch(() => {
        mongoose.connect(String(process.env.MONGO_LOCAL)).then(() => {
          console.log('Local DB connection successful!');
        });
      });

    await this.initialiseDatabaseContent();
  }

  private async initialiseDatabaseContent() {
    const restart = await importDefaultData();
    if (restart && this.server) {
      this.server.close((err: Error | undefined) => {
        console.log('server closed');
        process.exit(err ? 1 : 0);
      });
    }
  }

  public listen(): void {
    this.server = this.express.listen(this.port, () => {
      console.log(`App is running on port: ${this.port}... mode:${process.env.NODE_ENV}`);
    });
  }

  private routeErrorHandling = (): void => {
    this.express.all('*', (req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ error: 'not found' });
    });
  };
}

export default App;
