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
    component: () => import('pages/NotAuthorized.vue'),
    meta: {
      resource: 'Auth'
    }
  },
  // Always leave 404 as last route, or remove
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
