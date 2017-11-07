import * as express from 'express';
import * as eventControllers from './events.controllers';
import requiresLogin from '../authentication/passport.requiresLogin';

export const router = express.Router();

router.route('/events/:time').get(eventControllers.list);
router.route('/events/').post(requiresLogin, eventControllers.create);
router.route('/events/:id/:action').post(requiresLogin, eventControllers.join);
