import axios from '@/libs/api.request'

export const store = phone => axios.request({ url: '/verify_code', method: 'post', data: { phone } })
