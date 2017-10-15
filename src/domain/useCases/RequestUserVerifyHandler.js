class RequestUserVerifyHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  handle(requestMessage) {
    var user = this.getUser(requestMessage.userId);
    user.verified = true;
    user = this.userRepository.update(user);
    return user;
  }

  getUser(userId) {
    const user = this.userRepository.getById(userId);
    if (!user) throw new Error('UserNotFoundException');
    if (user.verified) throw new Error('UserAlreadyVerifiedException');
    return user;
  }
}

module.exports = RequestUserVerifyHandler;
