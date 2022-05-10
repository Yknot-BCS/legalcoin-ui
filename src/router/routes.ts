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
    path: '/admin',
    name: 'admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Admin.vue') }],
    meta: {
      layout: 'full',
      resource: 'Admin',
      redirectIfLoggedIn: true
    }
  },
  {
    path: '/access-control',
    name: 'access-control',
    component: () => import('pages/Client.vue'),
    meta: {
      resource: 'Auth'
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
