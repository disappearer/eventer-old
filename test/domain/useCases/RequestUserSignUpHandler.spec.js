describe('Request User Sign Up Handler', function() {
  var userRepository, requestUserSignUpHandler, requestMessage;

  beforeEach(function() {
    userRepository = new UserRepository();
    requestUserSignUpHandler = new RequestUserSignUpHandler(userRepository);
    requestMessage = {
      name: 'Non-unique Display Name',
      email: 'address@mail.com'
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
});
