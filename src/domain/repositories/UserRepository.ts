import Repository from './Repository';
import User from '../entities/User';

export default interface UserRepository extends Repository<User> {
  getByEmail(email: string): Promise<User>;
};
