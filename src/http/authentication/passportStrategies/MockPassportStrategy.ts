import { Strategy } from 'passport-strategy';
import User from '../../../domain/entities/User';
import { server } from '../../server';

export default class MockPassportStrategy extends Strategy {
  name: string;
  passAuthentication: boolean;
  userId: number;
  verify: Function;

  constructor(options: any, verify: Function) {
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

export function getPassStrategy(userid: number) {
  return new MockPassportStrategy(
    { passAuthentication: true, userId: userid },
    (user: User, done: Function) => {
      server.userRepository.getById(user.id).then(user => {
        done(null, user);
      });
    }
  );
}
