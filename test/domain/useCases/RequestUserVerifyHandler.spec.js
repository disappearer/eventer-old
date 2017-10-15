describe('Request User Verify Handler', function() {
  var userRepository, requestUserVerifyHandler, requestUserVerifyMessage;

  beforeEach(function() {
    userRepository = new UserRepository();
    const notificationService = {
      sendEmail: function(emailAddress, content) {}
    };
    const requestUserSignUpHandler = new RequestUserSignUpHandler(
      userRepository,
      notificationService
    );
    const requestSignUpMessage = {
      name: 'Non-unique Display Name',
      email: 'address@mail.com',
      verified: false
    };
    const user = requestUserSignUpHandler.handle(requestSignUpMessage);
    requestUserVerifyMessage = {
      userId: user.id,
      verificationToken: user.verificationToken
    };
    requestUserVerifyHandler = new RequestUserVerifyHandler(userRepository);
  });

  it('changes user\'s verified field to "true"', function() {
    returnedUser = requestUserVerifyHandler.handle(requestUserVerifyMessage);
    expect(returnedUser.verified).toBe(true);
  });

  it('persists the change', function() {
    requestUserVerifyHandler.handle(requestUserVerifyMessage);
    const savedUser = userRepository.getById(requestUserVerifyMessage.userId);
    expect(savedUser.verified).toBe(true);
  });

  it('throws error if user already verified', function() {
    requestUserVerifyHandler.handle(requestUserVerifyMessage);
    expect(function() {
      requestUserVerifyHandler.handle(requestUserVerifyMessage);
    }).toThrowError('UserAlreadyVerifiedException');
  });

  it('throws error if user not found', function() {
    spyOn(userRepository, 'getById').and.callFake(function() {
      return null;
    });
    expect(function() {
      requestUserVerifyHandler.handle(requestUserVerifyMessage);
    }).toThrowError('UserNotFoundException');
  });
});
