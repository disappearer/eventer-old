const UserSignUpHandler = require(process.env.SRC +
  '/domain/useCases/UserSignUpHandler');
const User = require(process.env.SRC + '/domain/entities/User');

describe('Request User Sign Up Handler', function() {
  var userRepository, notificationService, userSignUpHandler, requestMessage;

  beforeEach(function() {
    userRepository = new UserRepository();
    notificationService = { sendEmail: function(emailAddress, content) {} };
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

  it('creates a new user without password', function() {
    const user = userSignUpHandler.handle(requestMessage);
    expect(user).toEqual(jasmine.any(User));
    expect(user.displayName).toEqual(requestMessage.name);
    expect(user.email).toEqual(requestMessage.email);
  });

  it('creates a new user with password', function() {
    requestMessage.password = 'encrypted_pass';
    const user = userSignUpHandler.handle(requestMessage);
    expect(user).toEqual(jasmine.any(User));
    expect(user.displayName).toEqual(requestMessage.name);
    expect(user.email).toEqual(requestMessage.email);
    expect(user.password).toEqual(requestMessage.password);
  });

  it('persists the new user', function() {
    const returnedUser = userSignUpHandler.handle(requestMessage);
    const savedUser = userRepository.getById(returnedUser.id);
    expect(savedUser).toEqual(returnedUser);
  });

  it('throws if email already in repository', function() {
    const returnedUser1 = userSignUpHandler.handle(requestMessage);
    expect(function() {
      const returnedUser2 = userSignUpHandler.handle(requestMessage);
    }).toThrowError('EmailInUseException');
  });

  it('sends verification email if not verified (local sign-up)', function() {
    requestMessage.verified = false;
    spyOn(notificationService, 'sendEmail');
    const returnedUser = userSignUpHandler.handle(requestMessage);
    expect(notificationService.sendEmail).toHaveBeenCalledWith(
      returnedUser.email,
      returnedUser.id + ':' + returnedUser.verificationToken
    );
  });
});
