import request from '../utils/request';

// 创建网络
export function createNetwork(data) {
  return request({
    url: 'network/create',
    method: 'post',
    data
  })
}

// 获取网络列表
export function listNetwork(query) {
  return request({
    url: 'network/list',
    method: 'get',
    params: query
  })
}

// 删除网络
export function removeNetwork(data) {
  return request({
    url: 'network/delete',
    method: 'post',
    data
  })
}
