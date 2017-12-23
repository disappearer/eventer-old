import * as express from 'express';
import * as eventControllers from './events.controllers';
import * as passport from 'passport';
import requiresLogin from '../authentication/passport.requiresLogin';

export const router = express.Router();

router.route('/events/:time').get(eventControllers.list);
router
  .route('/events/')
  .post(
    passport.authenticate('bearer', { session: false }),
    eventControllers.create
  );
router
  .route('/events/:id/:action')
  .post(
    passport.authenticate('bearer', { session: false }),
    eventControllers.join
  );
