import * as passport from 'passport';
import { googlePassportStrategy } from './passportStrategies/passport.google';
import { tokenPassportStrategy } from './passportStrategies/passport.token';
import { server } from '../server';

passport.use(googlePassportStrategy);
passport.use(tokenPassportStrategy);

export default passport;
