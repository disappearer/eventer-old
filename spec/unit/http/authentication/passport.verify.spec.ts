import verify from '../../../../src/http/authentication/passport.verify';
import InMemoryUserRepository from '../../../../src/db/memory/InMemoryUserRepository';
import User from '../../../../src/domain/entities/User';

describe('Function verify()', () => {
  var callback: Function, userRepo: InMemoryUserRepository;
  const accessToken = 'randomString';
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
    verify(userRepo, accessToken, profile, callback).then(() => {
      userRepo.getByAuthProviderId(profile.provider, profile.id).then(user => {
        const authInfo = user.authenticationInfo.find(authInfo => {
          return authInfo.provider == profile.provider;
        });
        expect(authInfo.email).toEqual(profile.emails[0].value);
        expect(authInfo.name).toEqual(profile.displayName);
        expect(user.accessToken).toEqual(accessToken);
        done();
      });
    });
  });

  it('finds user if already registered', done => {
    verify(userRepo, accessToken, profile, callback).then(() => {
      userRepo.getByAuthProviderId(profile.provider, profile.id).then(user => {
        verify(userRepo, accessToken, profile, callback).then(() => {
          expect(callback).toHaveBeenCalledWith(null, user);
          done();
        });
      });
    });
  });

  it('forwards the new access token to the use case handler', done => {
    verify(userRepo, accessToken, profile, callback).then(() => {
      const differentAccessToken = 'differentRandomString';
      verify(userRepo, differentAccessToken, profile, callback).then(() => {
        userRepo
          .getByAuthProviderId(profile.provider, profile.id)
          .then(user => {
            expect(user.accessToken).toEqual(differentAccessToken);
            done();
          });
      });
    });
  });

  it('calls the callback with user', done => {
    verify(userRepo, accessToken, profile, callback).then(() => {
      expect(callback).toHaveBeenCalledWith(null, jasmine.any(User));
      done();
    });
  });

  it('calls the callback with caught error message', done => {
    const errorMessage = 'Some Error Occurred!';
    spyOn(userRepo, 'getByAuthProviderId').and.throwError(errorMessage);
    verify(userRepo, accessToken, profile, callback).then(() => {
      expect(callback).toHaveBeenCalledWith(errorMessage, null);
      done();
    });
  });
});
