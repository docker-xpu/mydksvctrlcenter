import request from '../utils/request'

// 获取全部主机凭据
export function listLicence() {
  return request({
    url: 'licence/all',
    method: 'get',
  })
}

// 获取主机列表
export function listHost() {
  return request({
    url: 'host/list',
    method: 'get',
  })
}

// 移除一台主机
export function removeHost(data) {
  return request({
    // url: 'host/remove',
    url: 'permission-host/remove',
    method: 'post',
    data
  })
}

// 测试主机连接
export function connHost(data) {
  return request({
    url: 'host/test-conn',
    method: 'post',
    data
  })
}

// 初始化主机
export function initHost(data) {
  return request({
    url: 'host/init',
    method: 'post',
    data
  })
}

// 新增主机凭据
export function newLicence(data) {
  return request({
    url: 'licence/new',
    method: 'post',
    data
  })
}

// 删除主机凭据
export function deleteLicence(data) {
  return request({
    url: 'licence/delete',
    method: 'post',
    data
  })
}

// 获取指定宿主机的文件列表
export function listHostFiles(query) {
  return request({
    url: 'sftp/list',
    method: 'get',
    params: query
  })
}

// 分发文件至多个宿主机
export function dispatchFile2Hosts(data) {
  return request({
    url: 'sftp/upload-list',
    method: 'post',
    data
  })
}
