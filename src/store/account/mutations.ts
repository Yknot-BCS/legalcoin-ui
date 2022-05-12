import { MutationTree } from 'vuex';
import { AccountStateInterface } from './state';
import { AccountDetails } from 'src/types';

export const mutations: MutationTree<AccountStateInterface> = {
  setCryptoAccountName(
    state: AccountStateInterface,
    cryptoAccountName: string
  ) {
    state.cryptoAccountName = cryptoAccountName;
  },
  setCryptoAccountDetails(
    state: AccountStateInterface,
    accountDetails: AccountDetails
  ) {
    state.cryptoAccountDetails = accountDetails;
  },
  setIsLoggedIn(state: AccountStateInterface, isLoggedIn: boolean) {
    state.isLoggedIn = isLoggedIn;
  }
};
