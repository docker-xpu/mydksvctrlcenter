import request from '../utils/request';
import requestJson from '../utils/request-json';

// 启动容器
export function startContainer(data) {
  return request({
    url: '/container/start',
    method: 'post',
    data
  })
}

// 获取容器日志信息
export function getContainerLogs(query) {
  return request({
    url: 'container/logs',
    method: 'get',
    params: query
  })
}

// 停止容器
export function stopContainer(data) {
  return request({
    url: '/container/stop',
    method: 'post',
    data
  })
}

// 删除容器
export function removeContainer(data) {
  return request({
    url: '/container/delete',
    method: 'post',
    data
  })
}

// 创建容器
export function createContainer(data) {
  return requestJson({
    url: '/container/create',
    method: 'post',
    data
  })
}

// 打包容器 -> 镜像
export function pushContainer(data) {
  return request({
    url: 'change/to-image',
    method: 'post',
    data
  })
}
