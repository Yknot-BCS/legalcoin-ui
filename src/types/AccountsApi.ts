// Backend types
export interface UserCryptoAccount {
  accountName: string;
  publicKey: string;
  secret: string;
  linkedAccounts: string[];
}

export type User = {
  name: string;
  surname: string;
  email: string;
  emailVerified: boolean;
  receiveEmailNotifications: boolean;
  cryptoAccount: UserCryptoAccount;
};

export type SignInResponse = {
  token: string;
  sessionLength: number;
};

// Extended types
export type Session = SignInResponse;
