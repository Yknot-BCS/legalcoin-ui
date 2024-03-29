import { MutationTree } from 'vuex';
import { AccountStateInterface } from './state';
import { AccountDetails, User, Session, BankInfo } from 'src/types';
import { SignTransactionResponse } from 'universal-authenticator-library';
import auth from 'src/auth';
import { UALPlatformSignerError } from 'src/components/auth/UALPlatformSignerError';

export const mutations: MutationTree<AccountStateInterface> = {
  setLoadingWallet(state: AccountStateInterface, wallet: string) {
    state.loading = wallet;
  },
  setLocalAccountName(state: AccountStateInterface, accountName: string) {
    state.localAccountName = accountName;
  },
  setLocalAccountDetails(
    state: AccountStateInterface,
    accountDetails: AccountDetails
  ) {
    state.localAccountDetails = accountDetails;
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
      _id: '',
      name: '',
      surname: '',
      email: '',
      emailVerified: false,
      receiveEmailNotifications: false,
      accountName: '',
      publicKey: '',
      secret: '',
      linkedAccounts: [''],
      kyc: '',
      bankInfo: {} as BankInfo
    };
    auth.setAccessToken('');
  },
  setUserProfile(state: AccountStateInterface, userProfile?: User) {
    state.profile = userProfile;
  },
  setUseLocalSigner(state: AccountStateInterface, useLocalSigner: boolean) {
    state.useLocalSigner = useLocalSigner;
  },
  setSignedTransaction(
    state: AccountStateInterface,
    transaction: SignTransactionResponse | null
  ) {
    state.platformSigner.signedTransactionResponse = transaction;
  },
  setSingedTransactionError(
    state: AccountStateInterface,
    error: UALPlatformSignerError
  ) {
    state.platformSigner.error = error;
  }
};
