import axios from '@/libs/api.request'

export const login = data => axios.request({ url: 'auth/login', method: 'post', data })
