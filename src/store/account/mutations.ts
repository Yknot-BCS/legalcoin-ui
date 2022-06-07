import { MutationTree } from 'vuex';
import { AccountStateInterface } from './state';
import { AccountDetails, User, Session } from 'src/types';
import auth from 'src/auth';
import { UALPlatformSignerError } from 'src/components/auth/UALPlatformSignerError';

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
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignedTransaction(state: AccountStateInterface, transaction: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    state.platformSigner.signedTransactionResponse = transaction; // TODO check types
  },
  setSingedTransactionError(
    state: AccountStateInterface,
    error: UALPlatformSignerError
  ) {
    state.platformSigner.error = error;
  }
};
