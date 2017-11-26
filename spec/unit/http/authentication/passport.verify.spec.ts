import verify from '../../../../src/http/authentication/passport.verify';
import InMemoryUserRepository from '../../../../src/db/memory/InMemoryUserRepository';
import User from '../../../../src/domain/entities/User';

describe('Function verify()', () => {
  var callback: Function, userRepo: InMemoryUserRepository;
  const profile = {
    provider: 'google',
    id: 123456,
    displayName: 'Non-unique Display Name',
    emails: [{ value: 'google.user123456@gmail.com', type: 'account' }]
  };

  beforeEach(() => {
    userRepo = new InMemoryUserRepository();
    callback = jasmine.createSpy('callback');
  });

  it('creates user if not found', done => {
    verify(userRepo, profile, callback).then(() => {
      userRepo.getByAuthProviderId(profile.provider, profile.id).then(user => {
        const authInfo = user.authenticationInfo.find(authInfo => {
          return authInfo.provider == profile.provider;
        });
        expect(authInfo.email).toEqual(profile.emails[0].value);
        expect(authInfo.name).toEqual(profile.displayName);
        done();
      });
    });
  });

  it('finds user if already registered', done => {
    verify(userRepo, profile, callback).then(() => {
      userRepo.getByAuthProviderId(profile.provider, profile.id).then(user => {
        verify(userRepo, profile, callback).then(() => {
          expect(callback).toHaveBeenCalledWith(null, user);
          done();
        });
      });
    });
  });

  it('calls the callback with user', done => {
    verify(userRepo, profile, callback).then(() => {
      expect(callback).toHaveBeenCalledWith(null, jasmine.any(User));
      done();
    });
  });

  it('calls the callback with caught error message', done => {
    const errorMessage = 'Some Error Occurred!';
    spyOn(userRepo, 'getByAuthProviderId').and.throwError(errorMessage);
    verify(userRepo, profile, callback).then(() => {
      expect(callback).toHaveBeenCalledWith(errorMessage, null);
      done();
    });
  });
});
