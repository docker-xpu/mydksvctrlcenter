import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';

import Logo from '../components/Logo';
import About from '../views/About';
import Hosts from '../views/Hosts';
import Images from '../views/Images';
import Editor from '../views/Editor';
import Network from '../views/Network';
import Cluster from '../views/Cluster';

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
        path: '/network',
        name: 'Network',
        component: Network,
        meta:{
          title: '网络'
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
