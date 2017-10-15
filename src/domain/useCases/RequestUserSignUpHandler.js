class RequestUserSignUpHandler {
  constructor(userRepository, notificationService) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  handle(requestMessage) {
    const user = this.createUser(requestMessage);
    const savedUser = this.userRepository.add(user);
    this.verifyEmailIfNotVerified(savedUser);
    return user;
  }

  createUser(requestMessage) {
    const user = this.userRepository.findOne({ email: requestMessage.email });
    if (user) throw new Error('EmailInUseException');
    return new User(
      0,
      requestMessage.name,
      requestMessage.email,
      requestMessage.password,
      requestMessage.verified
    );
  }

  verifyEmailIfNotVerified(user) {
    if (!user.verified) {
      var content = this.createVerificationMessage(user);
      this.notificationService.sendEmail(user.email, content);
    }
  }

  createVerificationMessage(user) {
    return user.id + ':' + user.verificationToken;
  }
}

module.exports = RequestUserSignUpHandler;
