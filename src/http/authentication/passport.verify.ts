import UserFindOrCreateHandler from '../../domain/useCases/UserFindOrCreateHandler';
import UserRepository from '../../domain/repositories/UserRepository';

async function verify(
  userRepository: UserRepository,
  profile: {
    provider: string;
    id: number;
    displayName: string;
    emails: Array<string>;
  },
  callback: Function
) {
  const requestMessage = {
    provider: profile.provider,
    id: profile.id,
    name: profile.displayName,
    email: profile.emails[0]
  };

  const userFindOrCreateHandler = new UserFindOrCreateHandler(userRepository);

  try {
    const user = await userFindOrCreateHandler.handle(requestMessage);
    callback(null, user);
  } catch (error) {
    callback(error.message, null);
  }
}

export default verify;
