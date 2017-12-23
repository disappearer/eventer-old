import UserRepository from '../repositories/UserRepository';
import User from '../entities/User';
import AuthProviderInfo from '../contracts/AuthProviderInfo';

export default class UserGetExistingHandler {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handle(requestMessage: { accessToken: string }) {
    const user = await this.userRepository.getByAccessToken(
      requestMessage.accessToken
    );
    if (!user) throw new Error('Error, access token does not exist');
    return user;
  }
}
