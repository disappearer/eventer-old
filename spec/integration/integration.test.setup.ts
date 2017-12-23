import User from '../../src/domain/entities/User';
import { getPassStrategy } from '../../src/http/authentication/passportStrategies/MockPassportStrategy';

export const profile = {
  provider: 'google',
  id: 111,
  displayName: 'Aleksa',
  emails: [{ value: 'aleksa47@gmail.com', type: 'account' }]
};

export const accessToken = 'random access token';

exports.integrationSetup = (server: any) => {
  server.setPassportStrategy(getPassStrategy(accessToken, profile));
};
