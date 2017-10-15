describe('Request User Sign Up Handler', function() {
  var userRepository,
    notificationService,
    requestUserSignUpHandler,
    requestMessage;

  beforeEach(function() {
    userRepository = new UserRepository();
    notificationService = { sendEmail: function(emailAddress, content) {} };
    requestUserSignUpHandler = new RequestUserSignUpHandler(
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
    const user = requestUserSignUpHandler.handle(requestMessage);
    expect(user).toEqual(jasmine.any(User));
    expect(user.displayName).toEqual(requestMessage.name);
    expect(user.email).toEqual(requestMessage.email);
  });

  it('creates a new user with password', function() {
    requestMessage.password = 'encrypted_pass';
    const user = requestUserSignUpHandler.handle(requestMessage);
    expect(user).toEqual(jasmine.any(User));
    expect(user.displayName).toEqual(requestMessage.name);
    expect(user.email).toEqual(requestMessage.email);
    expect(user.password).toEqual(requestMessage.password);
  });

  it('persists the new user', function() {
    const returnedUser = requestUserSignUpHandler.handle(requestMessage);
    const savedUser = userRepository.getById(returnedUser.id);
    expect(savedUser).toEqual(returnedUser);
  });

  it('throws if email already in repository', function() {
    const returnedUser1 = requestUserSignUpHandler.handle(requestMessage);
    expect(function() {
      const returnedUser2 = requestUserSignUpHandler.handle(requestMessage);
    }).toThrowError('EmailInUseException');
  });

  it('sends verification email if not verified (local sign-up)', function() {
    requestMessage.verified = false;
    spyOn(notificationService, 'sendEmail');
    const returnedUser = requestUserSignUpHandler.handle(requestMessage);
    expect(notificationService.sendEmail).toHaveBeenCalledWith(
      returnedUser.email,
      returnedUser.id + ':' + returnedUser.verificationToken
    );
  });
});
