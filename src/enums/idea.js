/*
 * 优化目标
 */
export const OPTIMIZE_TARGET_CONVERSION = 0 // 转化
export const OPTIMIZE_TARGET_CLICK = 1 // 点击
export const OPTIMIZE_TARGET_VIEW = 2 // 展现
export const optimize_targets = [
  {
    label: '转化',
    value: OPTIMIZE_TARGET_CONVERSION
  },
  {
    label: '点击',
    value: OPTIMIZE_TARGET_CLICK
  },
  {
    label: '展现',
    value: OPTIMIZE_TARGET_VIEW
  }
]

/*
 * 投放方式
 */
export const PUBLISH_METHOD_COST_FIRST = 0 // 成本优先
export const PUBLISH_METHOD_CONSTANT_SPEED_DELIVERY = 1 // 匀速投放
export const PUBLISH_METHOD_SPEED_UP_DELIVERY = 2 // 加速投放
export const publish_methods = [
  {
    label: '成本优先',
    value: PUBLISH_METHOD_COST_FIRST
  },
  {
    label: '匀速投放',
    value: PUBLISH_METHOD_CONSTANT_SPEED_DELIVERY
  },
  {
    label: '加速投放',
    value: PUBLISH_METHOD_SPEED_UP_DELIVERY
  }
]

/*
 * 投放目的
 */
export const PUBLISH_OBJECTIVE_TRAFFIC_ALLIANCE = 0 // 流量联盟
export const PUBLISH_OBJECTIVE_MOBILE_TRAFFIC = 1 // 移动流量
export const PUBLISH_OBJECTIVE_OPEN_PLATFORM = 2 // 开放平台
export const publish_objectives = [
  {
    label: '流量联盟',
    value: PUBLISH_OBJECTIVE_TRAFFIC_ALLIANCE
  },
  {
    label: '移动流量',
    value: PUBLISH_OBJECTIVE_MOBILE_TRAFFIC
  },
  {
    label: '开放平台',
    value: PUBLISH_OBJECTIVE_OPEN_PLATFORM
  }
]

/*
 * 展示类型
 */
export const VIEW_TYPE_640X320 = 0 // 大图 640*320
export const VIEW_TYPE_720X240 = 1 // 横图 720*240
export const VIEW_TYPE_640X200 = 2 // 横幅 640*200
export const VIEW_TYPE_230X152_SMALL = 3 // 小图 230*152
export const VIEW_TYPE_230X152_GROUP = 4 // 组图 230*152
export const view_types = [
  {
    label: '大图 640*320',
    value: VIEW_TYPE_640X320,
    style: { width: '640px', height: '320px' }
  },
  {
    label: '横图 720*240',
    value: VIEW_TYPE_720X240,
    style: { width: '720px', height: '240px' }
  },
  {
    label: '横幅 640*200',
    value: VIEW_TYPE_640X200,
    style: { width: '640px', height: '200px' }
  },
  {
    label: '小图 230*152',
    value: VIEW_TYPE_230X152_SMALL,
    style: { width: '230px', height: '152px' }
  },
  {
    label: '组图 230*152',
    value: VIEW_TYPE_230X152_GROUP,
    style: { width: '230px', height: '152px' }
  }
]
