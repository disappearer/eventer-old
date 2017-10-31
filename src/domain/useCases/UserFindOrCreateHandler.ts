import UserRepository from '../repositories/UserRepository';
import User from '../entities/User';

export default class UserFindOrCreateHandler {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handle(requestMessage: any) {
    var user = await this.userRepository.getByAuthProviderId(
      requestMessage.provider,
      requestMessage.id
    );
    if (user) return user;
    user = new User(110, [requestMessage]);
    user = await this.userRepository.add(user);
    return user;
  }
}
