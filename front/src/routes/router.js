import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/HomePage.vue') },
      { path: '/#:room[:player_name]', component: () => import('../pages/GamePage.vue'), props: true },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;