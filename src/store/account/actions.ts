import { Authenticator, User } from 'universal-authenticator-library';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AccountStateInterface } from './state';
import auth from 'src/auth';
import { ual } from 'src/boot/ual';
// import { PushTransactionResponse } from '@greymass/eosio';
import { SignTransactionResponse } from 'universal-authenticator-library';
import { Dialog } from 'quasar';
import PlatformSigner from 'src/components/auth/PlatformSigner.vue';

export const actions: ActionTree<AccountStateInterface, StateInterface> = {
  async cryptoLogin({ commit }, { account, authenticator }) {
    commit(
      'setLoadingWallet',
      (authenticator as Authenticator).getStyle().text
    );
    await (authenticator as Authenticator).init();
    if (!account) {
      const requestAccount = await (
        authenticator as Authenticator
      ).shouldRequestAccountName();
      if (requestAccount) {
        commit('setRequestAccount', true);
        return;
      }
    }
    const users = await (authenticator as Authenticator).login();
    if (users.length) {
      const account = users[0];
      const cryptoAccountName = await account.getAccountName();
      commit('setCryptoAccountName', cryptoAccountName);
      localStorage.setItem(
        'autoLogin',
        (authenticator as Authenticator).constructor.name
      );
      localStorage.setItem('account', cryptoAccountName);
      localStorage.setItem('returning', 'true');
      commit('setLoadingWallet');
    }
  },
  async sendTransaction({ dispatch }, { actions }) {
    /* eslint-disable */  // TODO enable eslint and fix types
    let transaction = null;
    if (this.state.account.useLocalSigner) {
      actions.forEach((action: { authorization: string | any[]; }) => {
        if (!action.authorization || !action.authorization.length) {
          action.authorization = [
            {
              actor: this.state.account.cryptoAccountName,
              permission: 'active'
            }
          ];
        }
      });
      const authenticators = ual.getAuthenticators().availableAuthenticators;
      const users = await authenticators[0].login();
      console.log(actions);
      try {
        transaction = await (users[0] as User).signTransaction(
          {
            actions
          },
          {
            blocksBehind: 3,
            expireSeconds: 30
          }
        );
      }
      catch (error) {
        console.error(actions, error);
        throw error;
      }
    }
    else {
      try {
        transaction = await dispatch('platformSign', { actions });
      }
      catch (error) {
        console.error(actions, error);
        throw error;
      }
    }
    return transaction;
  },

  async platformSign({ state, commit }, { actions }): Promise<SignTransactionResponse> {
    commit('setSignedTransaction', null);
    if (!await new Promise(resolve => Dialog.create({
      component: PlatformSigner,
      componentProps: { actions }
    })
      .onOk(() => { resolve(true) })
      .onCancel(() => { resolve(false) })
      .onDismiss(() => { resolve(true); }))
    ) throw new Error('Transaction cancelled by user');
    else {  // TODO improve error handling
      const transaction = state.platformSigner.signedTransaction;
      if (!transaction) throw new Error('Transaction signing failed');
      else if (transaction.error) {
        throw new Error(transaction.error.name);
      }
      else return transaction
    }
  },

  async refreshProfile({ commit }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const profile = await auth.getProfile();
    commit('setUserProfile', profile);
  }
};
