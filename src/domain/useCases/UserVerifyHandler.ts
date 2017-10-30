import UserRepository from '../repositories/UserRepository';
import User from '../entities/User';

export default class UserVerifyHandler {
  userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async handle(requestMessage: any) {
    var user = await this.getUser(requestMessage.userId);
    user.verified = true;
    user = await this.userRepository.update(user);
    return user;
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new Error('UserNotFoundException');
    if (user.verified) throw new Error('UserAlreadyVerifiedException');
    return user;
  }
}
