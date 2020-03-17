import axios from 'axios';
import store from '../store';
import { Notice, LoadingBar, Message } from 'view-design';

// 一个 axios 实例
const service = axios.create({
    baseURL: 'http://tim.natapp1.cc/',
    withCredentials: true, // send cookies when cross-domain requests
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
        LoadingBar.start();
        store.state.loading.push(Message.loading({
            duration: 0,
            content: '数据载入中...',
        }));

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
        if (store.state.loading.length === 1) {
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
