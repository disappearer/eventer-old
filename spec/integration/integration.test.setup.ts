import User from '../../src/domain/entities/User';
import { getPassStrategy } from '../../src/http/authentication/passportStrategies/MockPassportStrategy';
exports.integrationSetup = (server: any) => {
  // mock authorized user
  const profile = {
    provider: 'google',
    id: 111,
    displayName: 'Aleksa',
    emails: [{ value: 'aleksa47@gmail.com', type: 'account' }]
  };
  server.setPassportStrategy(getPassStrategy('randomString', profile));
};
