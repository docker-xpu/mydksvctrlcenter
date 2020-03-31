import request from '../utils/request';

// 用户登录
export function userLogin(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}

// 退出登录
export function userLogout() {
  return request({
    url: 'user/logout',
    method: 'get'
  })
}

// 获取文件列表
export function listFiles() {
  return request({
    url: 'images/list',
    method: 'get',
  })
}

// 删除一个文件
export function removeFile(query) {
  return request({
    url: 'images/delete',
    method: 'get',
    params: query
  })
}

// 上传代码至中心服务器
export function saveCode(data) {
  return request({
    url: 'code/save',
    method: 'post',
    data
  })
}

// 容器调度日志
export function listDispatchLog(query) {
  return request({
    url: 'dispatch/log',
    method: 'get',
    params: query
  })
}
