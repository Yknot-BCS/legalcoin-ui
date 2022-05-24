import { AccountDetails, User, Session } from 'src/types';

export interface AccountStateInterface {
  loading: unknown;
  cryptoAccountName: string;
  cryptoAccountDetails: AccountDetails;
  isLoggedIn: boolean;
  profile: User;
  session: Session;
}

export function state(): AccountStateInterface {
  return {
    // Local Signer
    loading: false,
    cryptoAccountName: '',
    cryptoAccountDetails: {} as AccountDetails,
    // Profile
    isLoggedIn: false,
    profile: {
      name: '',
      surname: '',
      email: '',
      emailVerified: false,
      receiveEmailNotifications: false
    },
    session: {
      token: '',
      sessionLength: 0
    }
  };
}
