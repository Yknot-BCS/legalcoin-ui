import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Home.vue') }]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/Auth.vue'),
    children: [{ path: '', component: () => import('pages/auth/Login.vue') }]
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('layouts/Auth.vue'),
    children: [{ path: '', component: () => import('pages/auth/Register.vue') }]
  },
  {
    path: '/buy',
    name: 'buy',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Buy.vue') }]
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Gallery.vue') }]
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Explore.vue') }]
  },
  {
    path: '/profile/:profile',
    name: 'profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Profile.vue') }]
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Wallet.vue') }]
  },
  {
    path: '/listing/:listing',
    name: 'listing',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SingleListing.vue') }]
  },
  {
    path: '/collection/:collection',
    name: 'collection',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Collection.vue') }]
  },
  {
    path: '/template/:collection/:template',
    name: 'template',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Template.vue') }]
  },
  {
    path: '/asset/:asset',
    name: 'asset',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Asset.vue') }]
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
