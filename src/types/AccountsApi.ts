// Backend types
export type User = {
  _id: string;
  name: string;
  surname: string;
  email: string;
  emailVerified: boolean;
  receiveEmailNotifications: boolean;
  accountName: string;
  publicKey: string;
  secret: string;
  linkedAccounts: string[];
  kyc: string;
  bankInfo: BankInfo;
};

export interface BankInfo {
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  bankAddress: string;
  swiftCode: string;
  iban: string;
}

export type SignInResponse = {
  token: string;
  sessionLength: number;
};

// Extended types
export type Session = SignInResponse;
