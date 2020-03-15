import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    // name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        name: 'Logo',
        component: () => import('../components/Logo')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('../views/About')
      },
      {
        path: '/hosts',
        name: 'Hosts',
        component: () => import('../views/Hosts')
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
