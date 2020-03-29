import axios from 'axios';
import store from '../store';
import {Notice, LoadingBar, Message} from 'view-design';

// 一个 axios 实例
const service = axios.create({
  baseURL: 'http://tim.natapp1.cc/',
  withCredentials: true, // send cookies when cross-domain requests
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
});

// request 拦截器
service.interceptors.request.use(
    config => {
      LoadingBar.start();
      if (store.state.loading.length === 0) {  // 同一时间只能有一个 loading message
        store.state.loading.push(Message.loading({
          duration: 0,
          content: '数据载入中...',
          closable: true
        }));
      }

      return config;
    },
    err => {
      return err;
    }
);

// response 拦截器
service.interceptors.response.use(
    res => {
      // Message.destroy();
      if (store.state.loading.length === 0) {
        LoadingBar.finish();
      }
      setTimeout(store.state.loading.pop(), 0);

      return res.data;
    },
    err => {
      // Message.destroy();

      Notice.error({
        title: '网络错误',
        desc: '臣妾做不到呀',
        duration: 0
      });

      LoadingBar.error();
      return err.data;
    }
);

export default service;
