/* eslint-disable */
import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { StateInterface, useStore } from '../store';
import routes from './routes';
import auth from 'src/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function (
  { store } /* { store, ssrContext } */
) {
  const createHistory = createWebHistory;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach(async (to, _) => {
    let isAuthenticated = store.state.account.profile.emailVerified;
    if (auth.isLoggedIn()) {
      try {
        if (store.state.account.profile.email == '') {
          await store.dispatch('account/refreshProfile');
        }
        isAuthenticated = store.state.account.profile.emailVerified;
        if (
          to.name !== 'emailverify-request' &&
          auth.isLoggedIn() &&
          !isAuthenticated
        ) {
          return { name: 'emailverify-request' };
        }
      } catch {
        console.log('Could not dispatch refreshProfile');
      }
    }
    // Route to home when already logged in
    if (to.name === 'login' && auth.isLoggedIn() && isAuthenticated) {
      return { name: 'home' };
    }
  });

  Router.afterEach(() => {
    // Remove initial loading
    const appLoading = document.getElementById('loading-bg');
    if (appLoading) {
      appLoading.style.display = 'none';
    }
  });

  return Router;
});
