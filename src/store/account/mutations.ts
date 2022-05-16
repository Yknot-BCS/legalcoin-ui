import { MutationTree } from 'vuex';
import { AccountStateInterface } from './state';
import { AccountDetails, User, Session } from 'src/types';
import { api } from 'src/api';

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
  setLogin(state: AccountStateInterface, session: Session) {
    state.session = session;
    state.isLoggedIn = true;
  },
  setLogout(state: AccountStateInterface) {
    state.isLoggedIn = false;
    state.session = {
      token: '',
      sessionLength: 0
    };
    state.profile = {
      name: '',
      surname: '',
      email: '',
      emailVerified: false,
      receiveEmailNotifications: false
    };
    api.accounts.setAccessToken('');
  },
  setUserProfile(state: AccountStateInterface, userProfile?: User) {
    state.profile = userProfile;
  }
};
