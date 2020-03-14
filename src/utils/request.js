import axios from 'axios';
import store from '../store';
import {Notice, LoadingBar} from 'view-design';

// 一个 axios 实例
const service = axios.create({
  baseURL: 'http://tim.natapp1.cc/',
  withCredentials: true,  // send cookies when cross-domain requests
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  // 请求预处理函数 可以把你传的param进行处理
  transformRequest: [
    data => {
      // data 就是你post请求传的值
      // 一下主要是吧数据拼接成 类似get格式
      let params = '';
      for (var index in data) {
        params += index + '=' + data[index] + '&'
      }
      return params
    }
  ],
  // xsrfCookieName: 'csrftoken',
  // xsrfHeaderName: 'X-CSRFToken',
  // timeout: 5000,  // request timeout
});

// request 拦截器
service.interceptors.request.use(
    config => {
      store.state.loading = true;

      return config;
    },
    err => {
      store.state.loading = false;

      return err;
    }
);

// response 拦截器
service.interceptors.response.use(
    res => {

      LoadingBar.finish();
      return res.data;
    },
    err => {
      Notice.error({
        title: '网络错误',
        desc: '小蜜蜂飞到了电波到不了的地方',
        duration: 5
      });

      LoadingBar.error();
      return err.data;
    }
);

export default service;
