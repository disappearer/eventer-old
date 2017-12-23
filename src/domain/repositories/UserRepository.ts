import Repository from './Repository';
import User from '../entities/User';

export default interface UserRepository extends Repository<User> {
  updateEventsJoined(user: User): Promise<User>;
  updateVerified(user: User): Promise<User>;
  updateAccessToken(user: User): Promise<User>;
  getByAuthProviderId(provider: string, id: number): Promise<User>;
  getByAccessToken(accessToken: string): Promise<User>;
};
