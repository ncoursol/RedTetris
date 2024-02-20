import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/HomePage.vue') },
      { path: ':room[:player_name]',
        component: () => import('../pages/GamePage.vue'),
        props: true,
        beforeEnter: (to, from, next) => {
          if (to.params.room === from.params.room) {
            next({ path: `/${to.params.room}/${to.params.player_name}` });
          } else {
            next();
          }
        }
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;