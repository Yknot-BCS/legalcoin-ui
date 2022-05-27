import { MutationTree } from 'vuex';
import { AccountStateInterface } from './state';
import { AccountDetails, User, Session } from 'src/types';
import auth from 'src/auth';

export const mutations: MutationTree<AccountStateInterface> = {
  setLoadingWallet(state: AccountStateInterface, wallet: string) {
    state.loading = wallet;
  },
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
  setisLoggedIn(state: AccountStateInterface, isLoggedIn: boolean) {
    state.isLoggedIn = isLoggedIn;
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
      receiveEmailNotifications: false,
      cryptoAccount: {
        accountName: '',
        publicKey: '',
        secret: '',
        linkedAccounts: ['']
      }
    };
    auth.setAccessToken('');
  },
  setUserProfile(state: AccountStateInterface, userProfile?: User) {
    state.profile = userProfile;
  },
  setUseLocalSigner(state: AccountStateInterface, useLocalSigner: boolean) {
    state.useLocalSigner = useLocalSigner;
  }
};
