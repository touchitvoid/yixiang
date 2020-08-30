import axios from '@/libs/api.request'

export const me = params => axios.request({ url: '/users/me', params })

export const resetMyPassword = data => axios.request({ url: '/users/me/password', method: 'patch', data })

export const resetPassword = (userId, password) => axios.request({ url: `/users/${userId}/password`, method: 'patch', data: { password } })

export const addBalance = (userId, balance) => axios.request({ url: `/users/${userId}/balance`, method: 'patch', data: { balance } })

export const subBalance = (userId, balance) => axios.request({ url: `/users/${userId}/balance`, method: 'delete', data: { balance } })

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
