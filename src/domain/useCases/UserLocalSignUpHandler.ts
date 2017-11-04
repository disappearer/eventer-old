import UserRepository from '../repositories/UserRepository';
import User from '../entities/User';
import AuthLocalInfo from '../../domain/contracts/AuthLocalInfo';

export default class UserLocalSignUpHandler {
  userRepository: UserRepository;
  notificationService: any;

  constructor(userRepository: UserRepository, notificationService: any) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  async handle(requestMessage: AuthLocalInfo) {
    const user = await this.createUser(requestMessage);
    const savedUser = await this.userRepository.add(user);
    this.verifyEmailIfNotVerified(savedUser);
    return user;
  }

  async createUser(requestMessage: AuthLocalInfo) {
    const user = await this.userRepository.findOne({
      email: requestMessage.email
    });
    if (user) throw new Error('EmailInUseException');
    return new User(0, [
      {
        id: 0,
        provider: 'local',
        name: requestMessage.name,
        email: requestMessage.email,
        password: requestMessage.password,
        verified: requestMessage.verified
      }
    ]);
  }

  verifyEmailIfNotVerified(user: User) {
    if (!user.verified) {
      var content = this.createVerificationMessage(user);
      this.notificationService.sendEmail(user.email, content);
    }
  }

  createVerificationMessage(user: User) {
    return user.id + ':' + user.verificationToken;
  }
}
