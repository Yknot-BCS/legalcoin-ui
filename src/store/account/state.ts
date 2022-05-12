import { AccountDetails } from 'src/types';

export interface AccountStateInterface {
  cryptoAccountName: string;
  cryptoIsAuthenticated: boolean;
  cryptoAccountDetails: AccountDetails;
  isLoggedIn: boolean;
  userName: string;
}

export function state(): AccountStateInterface {
  return {
    cryptoAccountName: '',
    cryptoIsAuthenticated: false,
    cryptoAccountDetails: {} as AccountDetails,
    isLoggedIn: false,
    userName: ''
  };
}
