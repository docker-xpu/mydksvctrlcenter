import request from '../utils/request';
import requestJson from '../utils/request-json';

// 创建集群
export function createPod(data) {
  return requestJson({
    url: 'cluster/create',
    method: 'post',
    data
  })
}

// 移除集群
export function removePod(data) {
  return request({
    url: 'cluster/remove',
    method: 'post',
    data
  })
}

// 启动集群
export function startPod(data) {
  return request({
    url: 'cluster/start',
    method: 'post',
    data
  })
}

// 停止集群
export function stopPod(data) {
  return request({
    url: 'cluster/stop',
    method: 'post',
    data
  })
}

// 获取集群列表
export function listPod(query) {
  return request({
    url: 'cluster-running/get-all',
    method: 'get',
    params: query
  })
}

// 获取单个容器的负载信息
export function getContainerLoadInfo(query) {
  return request({
    url: 'cluster-running/get-container',
    method: 'get',
    params: query
  })
}
