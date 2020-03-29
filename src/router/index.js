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
    name: 'Login',
    component: Login,
  },
  {
    path: '/Home',
    // name: 'Home',
    component: Home,
    children: [
      {
        path: '/Home',
        name: 'Index',
        component: Index,
      },
      {
        path: '/about',
        name: 'About',
        component: About,
        meta:{
          title: '关于'
        }
      },
      {
        path: '/hosts',
        name: 'Hosts',
        component: Hosts,
        meta:{
          title: '主机'
        }
      },
      {
        path: '/images',
        name: 'Images',
        component: Images,
        meta:{
          title: '镜像'
        }
      },
      {
        path: '/editor',
        name: 'Editor',
        component: Editor,
        meta:{
          title: 'iCode'
        }
      },
      {
        path: '/cluster',
        name: 'Cluster',
        component: Cluster,
        meta:{
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
