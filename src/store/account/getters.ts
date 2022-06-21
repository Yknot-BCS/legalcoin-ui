import { AccountDetails } from 'src/types';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { AccountStateInterface } from './state';

export const getters: GetterTree<AccountStateInterface, StateInterface> = {
  account(state): AccountStateInterface {
    return state;
  },
  cryptoIsAuthenticated(state): boolean {
    // TODO rename to isAuthenticated
    if (state.useLocalSigner) return !!state.localAccountName;
    else return !!state.profile.accountName;
  },
  cryptoAccountName(state): string {
    if (state.useLocalSigner) return state.localAccountName;
    else return state.profile.accountName;
  },
  getAccountData(state): AccountDetails {
    return state.localAccountDetails;
  },
  useLocalSigner(state): boolean {
    return state.useLocalSigner;
  },
  isLoggedIn(state): boolean {
    return state.isLoggedIn;
  }
};
