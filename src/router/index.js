import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';

import Index from '../views/Index';
import About from '../views/About';
import Hosts from '../views/Hosts';
import Images from '../views/Images';
import Editor from '../views/Editor';
import Cluster from '../views/Cluster';
import Login from '../views/Login';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    // name: 'Home',
    component: Home,
    children: [
      {
        path: '/home',
        name: 'Index',
        component: Index,
        meta:{
          title: 'Home',
          auth: true,
        }
      },
      {
        path: '/about',
        name: 'About',
        component: About,
        meta:{
          title: '关于',
          auth: true,
        }
      },
      {
        path: '/hosts',
        name: 'Hosts',
        component: Hosts,
        meta:{
          auth: true,
          title: '主机'
        }
      },
      {
        path: '/images',
        name: 'Images',
        component: Images,
        meta:{
          auth: true,
          title: '镜像'
        }
      },
      {
        path: '/editor',
        name: 'Editor',
        component: Editor,
        meta:{
          auth: true,
          title: 'iCode'
        }
      },
      {
        path: '/cluster',
        name: 'Cluster',
        component: Cluster,
        meta:{
          auth: true,
          title: '集群'
        }
      },
    ],
  },
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
