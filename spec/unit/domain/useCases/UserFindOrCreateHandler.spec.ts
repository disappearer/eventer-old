import UserFindOrCreateHandler from '../../../../src/domain/useCases/UserFindOrCreateHandler';
import InMemoryUserRepository from '../../../../src/db/memory/InMemoryUserRepository';
import User from '../../../../src/domain/entities/User';

describe('User Find Or Create Handler', () => {
  var userRepo: InMemoryUserRepository,
    userFindOrCreateHandler: UserFindOrCreateHandler,
    existingUser: User;

  const requestMessage = {
    accessToken: 'randomString',
    profile: {
      name: 'Display Name',
      provider: 'google',
      email: 'user@gmail.com',
      id: 1234
    }
  };

  beforeEach(done => {
    userRepo = new InMemoryUserRepository();
    userFindOrCreateHandler = new UserFindOrCreateHandler(userRepo);
    userFindOrCreateHandler.handle(requestMessage).then(returnedUser => {
      existingUser = returnedUser;
      done();
    });
  });

  it('finds user if already in repo', done => {
    userFindOrCreateHandler.handle(requestMessage).then(returnedUser => {
      expect(returnedUser).toEqual(existingUser);
      expect(returnedUser).not.toBe(existingUser);
      done();
    });
  });

  it('creates user if not in repo', done => {
    userRepo.getById(existingUser.id).then(returnedUser => {
      const authInfo = returnedUser.authenticationInfo.find(authInfo => {
        return authInfo.provider == requestMessage.profile.provider;
      });
      expect(authInfo.name).toEqual(requestMessage.profile.name);
      expect(authInfo.provider).toEqual(requestMessage.profile.provider);
      expect(authInfo.provider).toEqual(requestMessage.profile.provider);
      done();
    });
  });

  it('sets API access token for the user', done => {
    userRepo.getById(existingUser.id).then(returnedUser => {
      expect(returnedUser.accessToken).toEqual(requestMessage.accessToken);
      done();
    });
  });
});
