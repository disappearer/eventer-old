import * as passport from 'passport';
import { googlePassportStrategy } from './passportStrategies/passport.google';

passport.use(googlePassportStrategy);

export default passport;
