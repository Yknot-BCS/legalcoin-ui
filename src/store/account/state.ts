import { AccountDetails } from 'src/types';

export interface AccountStateInterface {
  cryptoAccountName: string;
  cryptoIsAuthenticated: boolean;
  cryptoAccountDetails: AccountDetails;
}

export function state(): AccountStateInterface {
  return {
    cryptoAccountName: '',
    cryptoIsAuthenticated: false,
    cryptoAccountDetails: {} as AccountDetails
  };
}
