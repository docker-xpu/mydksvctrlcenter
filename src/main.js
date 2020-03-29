import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

// animate
import animated from 'animate.css';

import {codemirror} from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';

import axios from 'axios';

Vue.prototype.$axios = axios;

Vue.use(ViewUI);
Vue.use(animated);
Vue.use(codemirror);

Vue.config.productionTip = false;

ViewUI.LoadingBar.config({
  height: 5
});

ViewUI.Message.config({
  top: 50,
  duration: 6,
});

router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title + ' - 筋斗云'
  }
  let validator = typeof to.meta.auth == "undefined" || !to.meta.auth || localStorage.getItem('is_login');
  let result = validator ? {} : {
    name: "login",　　// 跳转到命名路由
    query: {
      url: to.fullPath   // 做一个来源页面，用于登陆成功之后跳转
    }
  };
  next(result);
});

router.afterEach(route => {
  ViewUI.LoadingBar.finish();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
