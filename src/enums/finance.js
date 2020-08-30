/**
 * 交易类型
 */
export const TYPE_BALANCE_UP = 0 // 充值
export const TYPE_BALANCE_DOWN = 1 // 扣款
export const types = [
  {
    label: '充值',
    value: TYPE_BALANCE_UP
  },
  {
    label: '扣款',
    value: TYPE_BALANCE_DOWN
  }
]

/**
 * 交易方式
 */
export const METHOD_UNKNOWN = 0 // 未知
export const methods = [
  {
    label: '未知',
    value: METHOD_UNKNOWN
  }
]
