import User from '../../src/domain/entities/User';
import { getPassStrategy } from '../../src/http/authentication/passportStrategies/MockPassportStrategy';
exports.integrationSetup = (server: any) => {
  // mock authorized user
  const testUser = new User(420, [
    {
      provider: 'google',
      name: 'Aleksa',
      email: 'aleksa47@gmail.com',
      id: 1234
    }
  ]);
  server.userRepository.add(testUser).then((user: User) => {
    server.setPassportStrategy(getPassStrategy(user.id));
  });
};
