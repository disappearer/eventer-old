import UserSignUpHandler from '../../../src/domain/useCases/UserSignUpHandler';
import InMemoryUserRepository from '../../../src/db/InMemoryUserRepository';
import User from '../../../src/domain/entities/User';
import AuthLocalInfo from '../../../src/domain/contracts/AuthLocalInfo';

describe('User Sign Up Handler (local authentication provider)', () => {
  var userRepository: InMemoryUserRepository,
    notificationService: any,
    userSignUpHandler: UserSignUpHandler,
    requestMessage: AuthLocalInfo;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    notificationService = {
      sendEmail: (emailAddress: string, content: string) => {
        emailAddress;
        content;
      }
    };
    userSignUpHandler = new UserSignUpHandler(
      userRepository,
      notificationService
    );
    requestMessage = {
      id: 10,
      provider: 'local',
      name: 'Non-unique Display Name',
      email: 'address@mail.com',
      password: 'password',
      verified: true
    };
  });

  it('creates a new user', done => {
    userSignUpHandler.handle(requestMessage).then((user: User) => {
      expect(user).toEqual(jasmine.any(User));
      expect(user.name).toEqual(requestMessage.name);
      expect(user.email).toEqual(requestMessage.email);
      expect(user.password).toEqual(requestMessage.password);
      done();
    });
  });

  it('persists the new user', done => {
    userSignUpHandler.handle(requestMessage).then((returnedUser: User) => {
      userRepository.getById(returnedUser.id).then(savedUser => {
        expect(savedUser).toEqual(returnedUser);
        done();
      });
    });
  });

  it('throws if email already in repository', done => {
    var firstSignup = userSignUpHandler.handle(requestMessage);
    var secondSignup = firstSignup.then(() => {
      return userSignUpHandler.handle(requestMessage);
    });
    Promise.all([firstSignup, secondSignup]).catch(function(error) {
      expect(error).toEqual(new Error('EmailInUseException'));
      done();
    });
  });

  it('sends verification email if not verified (local sign-up)', done => {
    requestMessage.verified = false;
    spyOn(notificationService, 'sendEmail');
    userSignUpHandler.handle(requestMessage).then((returnedUser: User) => {
      expect(notificationService.sendEmail).toHaveBeenCalledWith(
        returnedUser.email,
        returnedUser.id + ':' + returnedUser.verificationToken
      );
      done();
    });
  });
});
