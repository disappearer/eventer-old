import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import * as express from 'express';
import * as session from 'express-session';

import passport from './authentication/passport.config';
import { googlePassportStrategy } from './authentication/passportStrategies/passport.google';
import { router as passportRouter } from './authentication/passport.routes';

import * as logger from 'morgan'; // dev
import * as path from 'path';
import errorHandler = require('errorhandler'); // dev
import methodOverride = require('method-override');

import UserRepository from '../domain/repositories/UserRepository';
import EventRepository from '../domain/repositories/EventRepository';
import { eventRepository as inMemEventRepo } from '../db/memory/InMemoryEventRepository';
import { userRepository as inMemUserRepo } from '../db/memory/InMemoryUserRepository';
import { whenCollections } from '../db/mongodb/mongodb.config';
import { router as eventsRouter } from './events/events.routes';

export default class Server {
  public app: express.Application;
  public eventRepository: EventRepository;
  public userRepository: UserRepository;

  public static bootstrap(): Server {
    return new Server();
  }

  constructor() {
    //create expressjs application
    this.app = express();

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
    if (
      process.env.NODE_ENV != 'unit-test' &&
      process.env.NODE_ENV != 'integration-test'
    )
      this.app.use(logger('dev'));

    this.app.use(bodyParser.json());

    this.app.use(
      session({
        secret: 'cave opener',
        saveUninitialized: true,
        resave: true
      })
    );

    passport.use(googlePassportStrategy);
    this.app.use(passport.initialize());
    this.app.use(passport.session());

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
    this.app.use(eventsRouter);
  }

  // for setting mock passport
  public setPassportStrategy(strategy: passport.Strategy) {
    passport.use(strategy);
  }
}

export const server = Server.bootstrap();
