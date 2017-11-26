import UserLocalSignUpHandler from '../../../../src/domain/useCases/UserLocalSignUpHandler';
import UserVerifyHandler from '../../../../src/domain/useCases/UserVerifyHandler';
import InMemoryUserRepository from '../../../../src/db/memory/InMemoryUserRepository';

describe('User Verify Handler', () => {
  var userRepository: InMemoryUserRepository,
    userVerifyHandler: UserVerifyHandler,
    requestUserVerifyMessage: any;

  beforeEach(done => {
    userRepository = new InMemoryUserRepository();
    const notificationService = {
      sendEmail: (emailAddress: string, content: string) => {
        emailAddress;
        content;
      }
    };
    const userSignUpHandler = new UserLocalSignUpHandler(
      userRepository,
      notificationService
    );
    const requestSignUpMessage = {
      id: 10,
      provider: 'local',
      name: 'Non-unique Display Name',
      email: 'address@mail.com',
      password: 'password',
      verified: false
    };
    const whenUser = userSignUpHandler.handle(requestSignUpMessage);
    whenUser.then(user => {
      requestUserVerifyMessage = {
        userId: user.id,
        verificationToken: user.verificationToken
      };
      done();
    });
    userVerifyHandler = new UserVerifyHandler(userRepository);
  });

  it('changes user\'s verified field to "true"', done => {
    userVerifyHandler.handle(requestUserVerifyMessage).then(returnedUser => {
      expect(returnedUser.verified).toBe(true);
      done();
    });
  });

  it('persists the change', done => {
    userVerifyHandler.handle(requestUserVerifyMessage).then(() => {
      userRepository
        .getById(requestUserVerifyMessage.userId)
        .then(savedUser => {
          expect(savedUser.verified).toBe(true);
          done();
        });
    });
  });

  it('throws error if user already verified', done => {
    userVerifyHandler
      .handle(requestUserVerifyMessage)
      .then(() => {
        return userVerifyHandler.handle(requestUserVerifyMessage);
      })
      .catch(error => {
        expect(error).toEqual(new Error('UserAlreadyVerifiedException'));
        done();
      });
  });

  it('throws error if user not found', done => {
    spyOn(userRepository, 'getById').and.callFake(() => {
      return Promise.resolve(null);
    });
    userVerifyHandler.handle(requestUserVerifyMessage).catch(error => {
      expect(error).toEqual(new Error('UserNotFoundException'));
      done();
    });
  });
});
