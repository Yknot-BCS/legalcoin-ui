import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Home.vue') }],
    meta: {
      layout: 'full',
      resource: 'Browse'
    }
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
    meta: {
      resource: 'Auth',
      redirectIfLoggedIn: true
    }
  },
  {
    path: '/buy',
    name: 'buy',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Buy.vue') }],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Gallery.vue') }],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Explore.vue') }],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/profile/:profile',
    name: 'profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Profile.vue') }],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Wallet.vue') }],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/listing/:listing',
    name: 'listing',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SingleListing.vue') }
    ],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/collection/:collection',
    name: 'collection',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Collection.vue') }],
    meta: {
      resource: 'Auth'
    }
  },
  {
    path: '/template/:collection/:template',
    name: 'template',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Template.vue') }],
    meta: {
      resource: 'Auth'
    }
  },
  {
    path: '/asset/:asset',
    name: 'asset',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Asset.vue') }],
    meta: {
      resource: 'Browse'
    }
  },
  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('src/pages/miscellaneous/NotAuthorized.vue'),
    meta: {
      resource: 'Auth'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('src/pages/miscellaneous/Error404.vue'),
    meta: {
      resource: 'Auth'
    }
  },
  {
    path: '/coming-soon',
    name: 'coming-soon',
    component: () => import('src/pages/miscellaneous/coming-soon.vue'),
    meta: {
      resource: 'Auth'
    }
  },
  // Always leave 404 as last route, or remove
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/miscellaneous/Error404.vue')
  }
];

export default routes;
