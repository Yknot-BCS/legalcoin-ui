import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Home.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/auth/Login.vue')
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('pages/auth/Register.vue')
      }
    ]
  },
  {
    path: '/resetpassword',
    component: () => import('layouts/Auth.vue'),
    children: [
      {
        path: '',
        name: 'resetpassword',
        component: () => import('pages/auth/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/buy',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'buy', component: () => import('pages/Buy.vue') }
    ]
  },
  {
    path: '/gallery',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'gallery',
        component: () => import('pages/Gallery.vue')
      }
    ]
  },
  {
    path: '/explore',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'explore',
        component: () => import('pages/Explore.vue')
      }
    ]
  },
  {
    path: '/profile/:profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('pages/Profile.vue')
      },
      {
        path: 'edit',
        name: 'editprofile',
        component: () => import('pages/ProfileEdit.vue')
      },
      {
        path: 'settings',
        name: 'account-settings',
        component: () => import('pages/ProfileSettings.vue')
      }
    ]
  },
  {
    path: '/wallet',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'wallet', component: () => import('pages/Wallet.vue') },
      {
        path: '/buytokens/:status',
        name: 'buytokens',
        component: () => import('pages/BuyTokens.vue')
      },
      {
        path: '/txhistory',
        name: 'txhistory',
        component: () => import('pages/TxHistory.vue')
      }
    ]
  },
  {
    path: '/listing/:listing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'listing',
        component: () => import('pages/SingleListing.vue')
      }
    ]
  },
  {
    path: '/collection/:collection',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'collection',
        component: () => import('pages/Collection.vue')
      }
    ]
  },
  {
    path: '/template/:collection/:template',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'template',
        component: () => import('pages/Template.vue')
      }
    ]
  },
  {
    path: '/asset/:asset',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'asset', component: () => import('pages/Asset.vue') }
    ]
  },
  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('src/pages/miscellaneous/NotAuthorized.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('src/pages/miscellaneous/Error404.vue')
  },
  {
    path: '/coming-soon',
    name: 'coming-soon',
    component: () => import('src/pages/miscellaneous/coming-soon.vue')
  },
  // Always leave 404 as last route, or remove
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/miscellaneous/Error404.vue')
  }
];

export default routes;
