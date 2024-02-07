import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/HomeTest.vue';
import About from '../components/AboutTest.vue' ;

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;