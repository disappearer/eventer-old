import UserFindOrCreateHandler from '../../domain/useCases/UserFindOrCreateHandler';
import UserRepository from '../../domain/repositories/UserRepository';

async function verify(
  userRepository: UserRepository,
  accessToken: string,
  profile: {
    provider: string;
    id: number;
    displayName: string;
    emails: Array<{ value: string; type: string }>;
  },
  done: Function
) {
  const requestMessage = {
    accessToken: accessToken,
    profile: {
      provider: profile.provider,
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    }
  };

  const userFindOrCreateHandler = new UserFindOrCreateHandler(userRepository);

  try {
    const user = await userFindOrCreateHandler.handle(requestMessage);
    done(null, user);
  } catch (error) {
    done(error.message, null);
  }
}

export default verify;
