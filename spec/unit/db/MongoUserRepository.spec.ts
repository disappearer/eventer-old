import { Db, Collection } from 'mongodb';
import { whenDb } from '../../../src/db/mongodb/mongodb.config';
import UserRepository, {
  toDomainUser
} from '../../../src/db/mongodb/MongoUserRepository';
import Event from '../../../src/domain/entities/Event';
import User from '../../../src/domain/entities/User';

const jsonUsers = require('../../../src/db/users.json');

describe('Mongo Users Repository', () => {
  var db: Db,
    testUsers: Collection,
    testGoogleProvider: Collection,
    repoUsers: Array<User>,
    userRepository: UserRepository;

  beforeAll(done => {
    whenDb.then(database => {
      db = database;
      db
        .createCollection('testUsers')
        .then(collection => {
          testUsers = collection;
          return db.createCollection('testGoogleProvider');
        })
        .then(collection => {
          testGoogleProvider = collection;
          userRepository = new UserRepository(testUsers, {
            google: testGoogleProvider
          });
          const whenAdded: Array<Promise<User>> = jsonUsers.users.map(
            (userInfo: any) => {
              return userRepository.add(Object.assign(new User(), userInfo));
            }
          );
          Promise.all(whenAdded).then(users => {
            repoUsers = users;
            done();
          });
        });
    });
  });

  it('can add user to users collection and auth info to provider collection(s)', done => {
    testUsers
      .find()
      .toArray()
      .then(dbUsers => {
        Promise.all(
          dbUsers.map(async dbUser => {
            const authInfo = await testGoogleProvider.findOne({
              _id: dbUser.authentication[0].providerInfoId
            });
            authInfo.provider = dbUser.authentication[0].providerName;
            return toDomainUser(dbUser, [authInfo]);
          })
        ).then(dbUsers => {
          repoUsers.forEach(repoUser => {
            expect(dbUsers.find(dbUser => dbUser === repoUser)).not.toBeNull();
          });
          done();
        });
      });
  });

  it('can get user by id or return null if not found', done => {
    userRepository
      .getById(0)
      .then(user => {
        expect(user).toBeNull();
        return userRepository.getById(repoUsers[0].id);
      })
      .then(user => {
        expect(user).toEqual(repoUsers[0]);
        done();
      });
  });

  it('can get user by authentication provider and id', done => {
    userRepository
      .getByAuthProviderId(
        repoUsers[0].authenticationInfo[0].provider,
        repoUsers[0].authenticationInfo[0].id
      )
      .then(user => {
        expect(user).toEqual(repoUsers[0]);
        done();
      });
  });

  it("can update user's eventsJoined list", done => {
    const event = new Event(
      11,
      22,
      'Some Event',
      'Description...',
      new Date(),
      'Nowhere'
    );
    userRepository
      .getById(repoUsers[0].id)
      .then(user => {
        expect(user.eventsJoined.indexOf(event.id)).toBe(-1);
        user.joinEvent(event);
        return userRepository.updateEventsJoined(user);
      })
      .then(user => {
        expect(repoUsers[0]).not.toEqual(user);
        expect(user.eventsJoined.indexOf(event.id)).toBeGreaterThanOrEqual(0);
        testUsers.findOne({ _id: user.id }).then(dbUser => {
          Promise.all(
            dbUser.authentication.map(async (authDbInfo: any) => {
              const authInfo = await testGoogleProvider.findOne({
                _id: authDbInfo.providerInfoId
              });
              authInfo.provider = authDbInfo.providerName;
              return authInfo;
            })
          ).then(dbAuth => {
            expect(toDomainUser(dbUser, dbAuth)).toEqual(user);
            done();
          });
        });
      });
  });

  afterAll(done => {
    Promise.all([testUsers.drop(), testGoogleProvider.drop()]).then(() => {
      done();
    });
  });
});
