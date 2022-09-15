// Backend types
export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  emailVerified: boolean;
  receiveEmailNotifications: boolean;
  accountName: string;
  publicKey: string;
  secret: string;
  linkedAccounts: string[];
  kyc: boolean;
};

export type SignInResponse = {
  token: string;
  sessionLength: number;
};

// Extended types
export type Session = SignInResponse;
