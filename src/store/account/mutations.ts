import { MutationTree } from 'vuex';
import { AccountStateInterface } from './state';
import { AccountDetails, User, Session } from 'src/types';
import auth from 'src/auth';

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
    state.isAuthenticated = true;
  },
  setIsAuthenticated(state: AccountStateInterface, isAuthenticated: boolean) {
    state.isAuthenticated = isAuthenticated;
  },
  setLogout(state: AccountStateInterface) {
    state.isAuthenticated = false;
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
    auth.setAccessToken('');
  },
  setUserProfile(state: AccountStateInterface, userProfile?: User) {
    state.profile = userProfile;
  }
};
