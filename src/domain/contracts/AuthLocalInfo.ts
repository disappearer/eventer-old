import AuthProviderInfo from './AuthProviderInfo';

export default interface AuthLocalInfo extends AuthProviderInfo {
  password: string;
  verified: boolean;
};
