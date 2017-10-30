export default interface AuthProviderInfo {
  provider: string;
  id: number;
  name: string;
  email: string;
  password?: string;
  verified?: boolean;
  verificationToken?: string;
};
