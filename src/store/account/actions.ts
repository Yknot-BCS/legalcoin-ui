import { Authenticator, User } from 'universal-authenticator-library';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AccountStateInterface } from './state';

export const actions: ActionTree<AccountStateInterface, StateInterface> = {
  async login({ commit }, { account, authenticator }) {
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
  async sendTransaction({}, { user, account, data }) {
    let transaction = null;
    const actions = [
      {
        account: account as string,
        name: 'transfer',
        authorization: [
          {
            actor: this.state.account.cryptoAccountName,
            permission: 'active'
          }
        ],
        data: data as unknown
      }
    ];
    try {
      transaction = await (user as User).signTransaction(
        {
          actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );
    } catch (e) {
      throw e;
    }
    return transaction;
  }
};
