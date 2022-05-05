/* eslint-disable */
import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import { StateInterface } from '../store';
import { canNavigate } from 'src/libs/acl/routeProtection';
import {
  isUserLoggedIn,
  getUserData,
  getHomeRouteForLoggedInUser
} from 'src/auth/utils';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach((to, _, next) => {
    const isLoggedIn = isUserLoggedIn();

    if (!canNavigate(to)) {
      // Redirect to login if not logged in
      if (!isLoggedIn) return next({ name: 'auth-login' });

      // If logged in => not authorized
      return next({ name: 'not-authorized' });
    }

    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && isLoggedIn) {
      const userData = getUserData();
      next(getHomeRouteForLoggedInUser(userData ? userData.role : null));
    }

    return next();
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
