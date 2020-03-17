import request from '../utils/request'

// 获取全部镜像
export function listImages() {
  return request({
    url: 'image/list',
    method: 'get',
  })
}
