import UserRepository from '../../domain/repositories/UserRepository';
import RepositoryError from '../../domain/repositories/RepositoryError';
import User from '../../domain/entities/User';

export default class InMemoryUserRepository implements UserRepository {
  users: Array<User>;

  constructor() {
    this.users = [];
  }

  createUser(id: number) {
    return new User(id, [
      {
        provider: 'local',
        id: 123 + id,
        name: 'User' + id,
        email: `user${id}@mail.com`
      }
    ]);
  }

  getById(id: number): Promise<User> {
    return new Promise(resolve => {
      if (id in this.users) return resolve(this.cloneUser(this.users[id]));
      const user = this.createUser(id);
      this.users[id] = user;
      resolve(this.cloneUser(user));
    });
  }

  getByAuthProviderId(provider: string, id: number): Promise<User> {
    return new Promise(resolve => {
      const user = this.users.find(user => {
        if (!user) return false;
        const authInfo = user.authenticationInfo.find(authInfo => {
          return authInfo.provider == provider && authInfo.id == id;
        });
        if (authInfo) return true;
      });
      resolve(user);
    });
  }

  getByAccessToken(accessToken: string): Promise<User> {
    return new Promise(resolve => {
      const user = this.users.find(
        user => (user ? user.accessToken === accessToken : false)
      );
      if (user) resolve(this.cloneUser(user));
      else resolve(null);
    });
  }

  findOne(query: any): Promise<User> {
    return new Promise(resolve => {
      const returnUser = this.users.find(user => {
        return user.email == query.email;
      });
      resolve(returnUser && this.cloneUser(returnUser));
    });
  }

  add(user: User): Promise<User> {
    return new Promise(resolve => {
      var returnUser = this.cloneUser(user);
      returnUser.id = this.users.length;
      this.users.push(returnUser);
      resolve(this.cloneUser(returnUser));
    });
  }

  updateEventsJoined(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!(user.id in this.users)) {
        reject(
          new RepositoryError(
            'UpdatingNonExistingUserException',
            user.id,
            user.constructor.name
          )
        );
      }

      this.users[user.id].eventsJoined = user.eventsJoined;
      resolve(this.cloneUser(this.users[user.id]));
    });
  }

  updateAccessToken(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!(user.id in this.users)) {
        reject(
          new RepositoryError(
            'UpdatingNonExistingUserException',
            user.id,
            user.constructor.name
          )
        );
      }

      this.users[user.id].accessToken = user.accessToken;
      resolve(this.cloneUser(this.users[user.id]));
    });
  }

  updateVerified(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!(user.id in this.users)) {
        reject(
          new RepositoryError(
            'UpdatingNonExistingUserException',
            user.id,
            user.constructor.name
          )
        );
      }
      this.users[user.id].authenticationInfo.map(authInfo => {
        if (authInfo.provider == 'local') authInfo.verified = user.verified;
      });
      resolve(this.cloneUser(this.users[user.id]));
    });
  }

  delete(user: User) {
    return new Promise((resolve, reject) => {
      if (!(user.id in this.users))
        reject(
          new RepositoryError(
            'DeletingNonExistingUserException',
            user.id,
            user.constructor.name
          )
        );
      this.users.splice(user.id, 1);
      resolve();
    });
  }

  cloneUser(user: User) {
    return Object.assign(Object.create(user), user);
  }

  getAll(): Promise<Array<User>> {
    return new Promise(resolve => {
      var userList = this.users.map(user => {
        return this.cloneUser(user);
      }, this);
      userList.sort((e1, e2) => {
        return e1.date - e2.date;
      });
      resolve(userList);
    });
  }
}

const userRepository = new InMemoryUserRepository();
export { userRepository };

/* read json and create Date fields */
var jsonUsers = require('./users.json').users;
jsonUsers.forEach((user: any) => {
  const userCopy = Object.assign(new User(0, []), user);
  userRepository.users[user.id] = userCopy;
});
