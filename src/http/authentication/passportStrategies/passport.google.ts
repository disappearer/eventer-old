import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userRepository } from '../../../db/memory/InMemoryUserRepository';
import verify from '../passport.verify';

export const googlePassportStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    verify(userRepository, profile, done);
  }
);
