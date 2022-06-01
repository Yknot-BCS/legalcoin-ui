import { Authenticator, User } from 'universal-authenticator-library';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AccountStateInterface } from './state';
import auth from 'src/auth';
import { ual } from 'src/boot/ual';

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
  async sendTransaction({}, { actions }) {
    console.log(actions);
    /* eslint-disable */
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
    console.log(actions)
    /* eslint-enable */
    let transaction = null;
    try {
      /* eslint-disable */
      const authenticators = ual.getAuthenticators().availableAuthenticators;
      const users = await authenticators[0].login();
      console.log(users);
      /* eslint-disable */
      transaction = await(users[0] as User).signTransaction(
        {
          actions
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );
    } catch (e) {
      console.error(actions, e);
      throw e;
    }
    return transaction;
  },

  async refreshProfile({ commit }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const profile = await auth.getProfile();
    commit('setUserProfile', profile);
  }
};
