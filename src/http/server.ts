import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import passport from './authentication/passport.config';
import { router as passportRouter } from './authentication/passport.routes';
import * as logger from 'morgan'; // dev
import * as path from 'path';
import errorHandler = require('errorhandler'); // dev
import methodOverride = require('method-override');
import UserRepository from '../domain/repositories/UserRepository';
import { userRepository } from '../db/InMemoryUserRepository';

export default class Server {
  public app: express.Application;
  public userRepository: UserRepository;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    //create expressjs application
    this.app = express();

    this.userRepository = userRepository;

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  public api() {
    //empty for now
  }

  public config() {
    this.app.use(logger('dev'));

    this.app.use(bodyParser.json());

    this.app.use(passport.initialize());

    //catch 404 and forward to error handler
    this.app.use(function(
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) {
      err.status = 404;
      next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  public routes() {
    this.app.use(passportRouter);
  }

  public setPassportStrategy(strategy: passport.Strategy) {
    passport.use(strategy);
  }
}
