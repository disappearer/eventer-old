import * as express from 'express';
import * as eventControllers from './events.controllers';

export const router = express.Router();

router.route('/events/').get(eventControllers.all);
