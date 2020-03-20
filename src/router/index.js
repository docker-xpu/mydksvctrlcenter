import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';

import Logo from '../components/Logo';
import About from '../views/About';
import Hosts from '../views/Hosts';
import Images from '../views/Images';
import Editor from '../views/Editor';

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
        component: Logo,
      },
      {
        path: '/about',
        name: 'About',
        component: About
      },
      {
        path: '/hosts',
        name: 'Hosts',
        component: Hosts
      },
      {
        path: '/images',
        name: 'Images',
        component: Images
      },
      {
        path: '/editor',
        name: 'Editor',
        component: Editor
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
