import UserGetExistingHandler from '../../../../src/domain/useCases/UserGetExistingHandler';
import { userRepository } from '../../../../src/db/memory/InMemoryUserRepository';
import User from '../../../../src/domain/entities/User';

describe('User Get Existing Handler', () => {
  var userGetExistingHandler: UserGetExistingHandler;
  const accessToken = 'randomString2';

  beforeEach(done => {
    userGetExistingHandler = new UserGetExistingHandler(userRepository);
    done();
  });

  it('finds user if exists', done => {
    Promise.all([
      userRepository.getByAccessToken(accessToken),
      userGetExistingHandler.handle({ accessToken: accessToken })
    ]).then(users => {
      expect(users[0]).toEqual(users[1]);
      done();
    });
  });

  it('throws error if user not found', done => {
    userGetExistingHandler
      .handle({ accessToken: 'token that is not' })
      .catch(error => {
        expect(error.message).toEqual('Error, access token does not exist');
        done();
      });
  });
});
