import request from '../utils/request';

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
