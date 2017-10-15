class RequestUserSignUpHandler {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  handle(requestMessage) {
    const user = new User(
      0,
      requestMessage.name,
      requestMessage.email,
      requestMessage.password
    );
    const savedUser = this.userRepository.add(user);
    return savedUser;
  }
}

module.exports = RequestUserSignUpHandler;
