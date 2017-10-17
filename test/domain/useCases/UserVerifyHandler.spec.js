const UserSignUpHandler = require(process.env.SRC +
  '/domain/usecases/UserSignUpHandler');
const UserVerifyHandler = require(process.env.SRC +
  '/domain/usecases/UserVerifyHandler');

describe('Request User Verify Handler', function() {
  var userRepository, userVerifyHandler, requestUserVerifyMessage;

  beforeEach(function() {
    userRepository = new UserRepository();
    const notificationService = {
      sendEmail: function(emailAddress, content) {
        emailAddress;
        content;
      }
    };
    const userSignUpHandler = new UserSignUpHandler(
      userRepository,
      notificationService
    );
    const requestSignUpMessage = {
      name: 'Non-unique Display Name',
      email: 'address@mail.com',
      verified: false
    };
    const user = userSignUpHandler.handle(requestSignUpMessage);
    requestUserVerifyMessage = {
      userId: user.id,
      verificationToken: user.verificationToken
    };
    userVerifyHandler = new UserVerifyHandler(userRepository);
  });

  it('changes user\'s verified field to "true"', function() {
    const returnedUser = userVerifyHandler.handle(requestUserVerifyMessage);
    expect(returnedUser.verified).toBe(true);
  });

  it('persists the change', function() {
    userVerifyHandler.handle(requestUserVerifyMessage);
    const savedUser = userRepository.getById(requestUserVerifyMessage.userId);
    expect(savedUser.verified).toBe(true);
  });

  it('throws error if user already verified', function() {
    userVerifyHandler.handle(requestUserVerifyMessage);
    expect(function() {
      userVerifyHandler.handle(requestUserVerifyMessage);
    }).toThrowError('UserAlreadyVerifiedException');
  });

  it('throws error if user not found', function() {
    spyOn(userRepository, 'getById').and.callFake(function() {
      return null;
    });
    expect(function() {
      userVerifyHandler.handle(requestUserVerifyMessage);
    }).toThrowError('UserNotFoundException');
  });
});
