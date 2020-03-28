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
