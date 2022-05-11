import { AccountDetails } from 'src/types';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AccountStateInterface } from './state';

export const getters: GetterTree<AccountStateInterface, StateInterface> = {
  account(state): AccountStateInterface {
    return state;
  },
  cryptoIsAuthenticated(state): boolean {
    return state.cryptoIsAuthenticated;
  },
  cryptoAccountName(state): string {
    return state.cryptoAccountName;
  },
  getAccountData(state): AccountDetails {
    return state.cryptoAccountDetails;
  }
};
