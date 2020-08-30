import axios from '@/libs/api.request'

export const overviewValues = params => axios.request({ url: 'statistics/overviewValues', method: 'get', params })

export const ideaStatistics = params => axios.request({ url: 'statistics/ideaStatistics', method: 'get', params })

export const ideaDateStatistics = params => axios.request({ url: 'statistics/ideaDateStatistics', method: 'get', params })

export const visitsStatistics = params => axios.request({ url: 'statistics/visitsStatistics', method: 'get', params })

export const visitsTable = params => axios.request({ url: 'statistics/visitsTable', method: 'get', params })
