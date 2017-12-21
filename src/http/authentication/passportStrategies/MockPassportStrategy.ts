import { Strategy } from 'passport-strategy';
import User from '../../../domain/entities/User';
import { server } from '../../server';
import verify from '../passport.verify';

export default class MockPassportStrategy extends Strategy {
  name: string;
  passAuthentication: boolean;
  userId: number;
  verify: Function;

  constructor(
    options: { passAuthentication: boolean; userId: number },
    verify: Function
  ) {
    super();
    this.name = 'mock';
    this.passAuthentication = options.passAuthentication && true;
    this.userId = options.userId || 1;
    this.verify = verify;
  }

  authenticate(req: any) {
    if (this.passAuthentication) {
      var user = {
          id: this.userId
        },
        self = this;
      this.verify(user, function(err: any, resident: User) {
        if (err) {
          self.fail(err);
        } else {
          self.success(resident, {});
        }
      });
    } else {
      this.fail('Unauthorized', 400);
    }
  }
}

export function getPassStrategy(accessToken: string, profile: any) {
  return new MockPassportStrategy(
    { passAuthentication: true, userId: 0 },
    (user: any, done: Function) => {
      verify(server.userRepository, accessToken, profile, done);
    }
  );
}
