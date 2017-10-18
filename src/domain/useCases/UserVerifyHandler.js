class UserVerifyHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async handle(requestMessage) {
    var user = await this.getUser(requestMessage.userId);
    user.verified = true;
    user = this.userRepository.update(user);
    return user;
  }

  async getUser(userId) {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new Error('UserNotFoundException');
    if (user.verified) throw new Error('UserAlreadyVerifiedException');
    return user;
  }
}

module.exports = UserVerifyHandler;
