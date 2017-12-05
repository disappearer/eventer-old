import * as express from 'express';
import * as passport from 'passport';
export const router = express.Router();

if(process.env.NODE_ENV=='integration-test'){
  router.get('/auth/mock',
    (req, res, next) => {
      passport.authenticate('mock')(req, res, next);
    },
    (req, res) => {
      if (!req.isAuthenticated())
        return res.status(401).send('Not authenticated.');
      res
        .status(200)
        .send(
          `Authentication success. User: ${req.user.authenticationInfo[0].name}`
        );
    }
  );
} else {
  router.get('/auth/:strategy', (req, res, next) => {
    passport.authenticate(req.params.strategy, { scope: ['profile', 'email'] })(
      req,
      res,
      next
    );
  });  
  
  router.get(
    '/auth/:strategy/callback',
    (req, res, next) => {
      passport.authenticate(req.params.strategy)(req, res, next);
    },
    (req, res) => {
      if (!req.isAuthenticated())
        return res.status(401).send('Not authenticated.');
      res
        .status(200)
        .send(
          `Authentication success. User: ${req.user.authenticationInfo[0].name}`
        );
    }
  );
}

router.get('/signout', (req, res) => {
  req.logout();
  return res.status(200).send(`Signout successs. User: ${req.user}`);
});
