import * as express from 'express';
import * as passport from 'passport';
export const router = express.Router();

router.get('/auth/:strategy', (req, res, next) => {
  passport.authenticate(req.params.strategy)(req, res, next);
});

router.get('/auth/:strategy/callback', (req, res, next) => {
  passport.authenticate(req.params.strategy)(req, res, next);
});
