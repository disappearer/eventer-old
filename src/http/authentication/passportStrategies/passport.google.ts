import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { server } from '../../../http/server';
import verify from '../passport.verify';

export const googlePassportStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.EVENTER_URL + '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    verify(server.userRepository, profile, done);
  }
);
