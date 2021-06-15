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


export function getNodeDetail(nodeId) {
  return request({
    url: '/api/admin/bee/node/'+nodeId,
    method: 'get',
  })
}

export function submitCashout(nodeId, peer, gasPrice) {
  return request({
    url: '/api/admin/bee/node/'+nodeId+"/cashout/"+peer,
    method: 'post',
    data: {
      gasPrice
    }
  })
}

export function getCashoutResult(nodeId, peer) {
  return request({
    url: '/api/admin/bee/node/'+nodeId+"/cashout/"+peer,
    method: 'get',
  })
}