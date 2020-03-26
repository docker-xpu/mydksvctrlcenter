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
