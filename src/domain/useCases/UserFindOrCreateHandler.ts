import UserRepository from '../repositories/UserRepository';
import User from '../entities/User';
import AuthProviderInfo from '../contracts/AuthProviderInfo';

export default class UserFindOrCreateHandler {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handle(requestMessage: {
    accessToken: string;
    profile: AuthProviderInfo;
  }) {
    let user = await this.userRepository.getByAuthProviderId(
      requestMessage.profile.provider,
      requestMessage.profile.id
    );
    if (!user) {
      user = new User(110, [requestMessage.profile]);
      user.accessToken = requestMessage.accessToken;
      user = await this.userRepository.add(user);
    } else {
      user.accessToken = requestMessage.accessToken;
      user = await this.userRepository.updateAccessToken(user);
    }
    return user;
  }
}
