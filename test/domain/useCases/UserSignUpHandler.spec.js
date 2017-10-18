const UserSignUpHandler = require(process.env.SRC +
  '/domain/useCases/UserSignUpHandler');
const User = require(process.env.SRC + '/domain/entities/User');

describe('User Sign Up Handler', () => {
  var userRepository, notificationService, userSignUpHandler, requestMessage;

  beforeEach(() => {
    userRepository = new UserRepository();
    notificationService = {
      sendEmail: (emailAddress, content) => {
        emailAddress;
        content;
      }
    };
    userSignUpHandler = new UserSignUpHandler(
      userRepository,
      notificationService
    );
    requestMessage = {
      name: 'Non-unique Display Name',
      email: 'address@mail.com',
      verified: true
    };
  });

  it('creates a new user without password', done => {
    userSignUpHandler.handle(requestMessage).then(user => {
      expect(user).toEqual(jasmine.any(User));
      expect(user.displayName).toEqual(requestMessage.name);
      expect(user.email).toEqual(requestMessage.email);
      done();
    });
  });

  it('creates a new user with password', done => {
    requestMessage.password = 'encrypted_pass';
    userSignUpHandler.handle(requestMessage).then(user => {
      expect(user).toEqual(jasmine.any(User));
      expect(user.displayName).toEqual(requestMessage.name);
      expect(user.email).toEqual(requestMessage.email);
      expect(user.password).toEqual(requestMessage.password);
      done();
    });
  });

  it('persists the new user', done => {
    userSignUpHandler.handle(requestMessage).then(returnedUser => {
      userRepository.getById(returnedUser.id).then(savedUser => {
        expect(savedUser).toEqual(returnedUser);
        done();
      });
    });
  });

  it('throws if email already in repository', done => {
    var firstSignup = userSignUpHandler.handle(requestMessage);
    var secondSignup = userSignUpHandler.handle(requestMessage);
    Promise.all([firstSignup, secondSignup]).catch(function(error) {
      expect(error).toEqual(new Error('EmailInUseException'));
      done();
    });
  });

  it('sends verification email if not verified (local sign-up)', done => {
    requestMessage.verified = false;
    spyOn(notificationService, 'sendEmail');
    userSignUpHandler.handle(requestMessage).then(returnedUser => {
      expect(notificationService.sendEmail).toHaveBeenCalledWith(
        returnedUser.email,
        returnedUser.id + ':' + returnedUser.verificationToken
      );
      done();
    });
  });
});
