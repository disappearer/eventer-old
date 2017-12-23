import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { server } from '../../../http/server';
import UserGetExistingHandler from '../../../domain/useCases/UserGetExistingHandler';

export const tokenPassportStrategy = new BearerStrategy(function(
  token: string,
  done: Function
) {
  const getUserHandler = new UserGetExistingHandler(server.userRepository);
  getUserHandler
    .handle({ accessToken: token })
    .then(user => {
      return done(null, user, { scope: 'all' });
    })
    .catch(error => {
      return done(error);
    });
});
