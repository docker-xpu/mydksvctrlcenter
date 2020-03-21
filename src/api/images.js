import request from '../utils/request'

// 获取全部镜像
export function listImages() {
  return request({
    url: 'image/list',
    method: 'get',
  })
}

// 删除镜像
export function removeImages(data) {
  return request({
    url: 'image/delete',
    method: 'post',
    data
  })
}
