import request from '@/utils/request'

export function getNodePage(query, pageNo, pageSize) {
  return request({
    url: '/api/admin/bee/node/page',
    method: 'get',
    params: {
      ...query,
      pageSize, pageNo
    }
  })
}
