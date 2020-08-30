import { Model as BaseModel } from 'vue-api-query'
import axios from '@/libs/api.request'
import { baseUrl } from '../libs/api.request'

BaseModel.$http = axios

export default class Model extends BaseModel {
  // define a base url for a REST API
  baseURL () {
    return baseUrl
  }

  // implement a default request method
  request (config) {
    return axios.request(config)
  }

  /**
   * 给定条件成立后，执行指定闭包
   *
   * @param condition {string} 条件判断表达式
   * @param callback 执行回调
   * @param def 条件判断失败执行回调
   * @returns {*|Model}
   */
  static when (condition, callback, def = null) {
    if (condition) return callback(this.instance(), condition)
    if (typeof def === 'function') return def(this.instance(), condition)

    return this.instance()
  }

  /**
   * 给定条件成立后，执行指定闭包
   *
   * @param condition {function} 条件判断表达式
   * @param callback 执行回调
   * @param def 条件判断失败执行回调
   * @returns {*|Model}
   */
  when (condition, callback, def = null) {
    // eslint-disable-next-line standard/no-callback-literal
    if (condition) return callback(this, condition)
    if (typeof def === 'function') return def(this, condition)

    return this
  }
}
