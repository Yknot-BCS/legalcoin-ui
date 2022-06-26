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

  Router.beforeEach((to, _) => {
    // Route to home when already logged in
    if (to.name === 'login' && auth.isLoggedIn()) {
      return { name: 'home' };
    }
    const isAuthenticated = store.state.account.profile.emailVerified
    if (to.name !== 'emailverify-request' && to.name === 'home' && !isAuthenticated) {
      return { name: 'emailverify-request' };
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
