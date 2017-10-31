import Repository from './Repository';
import User from '../entities/User';

export default interface UserRepository extends Repository<User> {
  getByAuthProviderId(provider: string, id: number): Promise<User>;
};
