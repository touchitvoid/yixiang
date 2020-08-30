import axios from 'axios'
import store from '@/store'
// import { Spin } from 'iview'
import { Message } from 'ant-design-vue'
import storage from 'store'

const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

const renderErrorMessages = ({ data }) => {
  let message = null

  try {
    if (data.message) {
      message = data.message
    }

    if (typeof data.errors === 'object') {
      message = data.errors[Object.keys(data.errors)[0]][0]
    }
  } catch {}

  message && Message.error(message)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Accept': 'application/json',
        'Authorization': storage.get('token')
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      return res
    }, error => {
      // this.destroy(url)
      // let errorInfo = error.response
      //
      // if (errorInfo.status === 401) {
      //   // store.dispatch('auth/logout')
      // }
      //
      // if (!errorInfo) {
      //   const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
      //   errorInfo = {
      //     statusText,
      //     status,
      //     request: { responseURL: config.url }
      //   }
      // }
      // addErrorLog(errorInfo)
      //
      // renderErrorMessages(error.response)
      //
      // return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
