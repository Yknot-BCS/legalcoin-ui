import { AccountDetails, User, Session } from 'src/types';

export interface AccountStateInterface {
  loading: unknown;
  cryptoAccountName: string;
  cryptoIsAuthenticated: boolean;
  cryptoAccountDetails: AccountDetails;
  isAuthenticated: boolean;
  profile: User;
  session: Session;
}

export function state(): AccountStateInterface {
  return {
    loading: false,
    cryptoAccountName: '',
    cryptoIsAuthenticated: false,
    cryptoAccountDetails: {} as AccountDetails,
    isAuthenticated: false,
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
