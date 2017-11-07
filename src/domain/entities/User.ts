import Event from './Event';
import AuthProviderInfo from '../contracts/AuthProviderInfo';
const randomstring = require('randomstring');

export default class User {
  id: number;
  authenticationInfo: Array<AuthProviderInfo>;
  eventsJoined: Array<number>;

  constructor(id: number, authenticationInfo: Array<AuthProviderInfo>) {
    this.id = id;
    this.authenticationInfo = authenticationInfo;
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (localProvider && !localProvider.verified)
      localProvider.verificationToken = randomstring.generate(13);
    this.eventsJoined = [];
  }

  get name(): string {
    // local authentication has precedence
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (!localProvider) return this.authenticationInfo[0].name;
    return localProvider.name;
  }

  get email(): string {
    // local authentication has precedence
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (!localProvider) return this.authenticationInfo[0].email;
    return localProvider.email;
  }

  get password(): string {
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (!localProvider) return null;
    return localProvider.password;
  }

  get verified(): boolean {
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (!localProvider) return null;
    return localProvider.verified;
  }

  set verified(verified: boolean) {
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (!localProvider) throw new Error('NoLocalAuthInfoException');
    localProvider.verified = verified;
  }

  get verificationToken(): string {
    const localProvider = this.authenticationInfo.find(authInfo => {
      return authInfo.provider == 'local';
    });
    if (!localProvider) return null;
    return localProvider.verificationToken;
  }

  joinEvent(event: Event) {
    if (this.isJoined(event)) throw new Error('EventAlreadyJoinedException');
    this.eventsJoined.push(event.id);
    return true;
  }

  isJoined(event: Event) {
    return this.eventsJoined.find(function(joinedEventId) {
      return joinedEventId == event.id;
    });
  }
}
