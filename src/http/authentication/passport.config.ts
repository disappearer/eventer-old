import * as passport from 'passport';
import { googlePassportStrategy } from './passportStrategies/passport.google';
import { server } from '../server';

passport.use(googlePassportStrategy);

passport.serializeUser(function(user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id: number, done) {
  server.userRepository
    .getById(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error, null);
    });
});

export default passport;
