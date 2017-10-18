const User = require('../entities/User');

class UserSignUpHandler {
  constructor(userRepository, notificationService) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  async handle(requestMessage) {
    var user;
    try {
      user = await this.createUser(requestMessage);
    } catch (error) {
      throw error;
    }
    const savedUser = await this.userRepository.add(user);
    this.verifyEmailIfNotVerified(savedUser);
    return user;
  }

  async createUser(requestMessage) {
    const user = await this.userRepository.findOne({
      email: requestMessage.email
    });
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

module.exports = UserSignUpHandler;
