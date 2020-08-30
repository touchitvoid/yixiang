/*
 * 性别
 */
export const GENDER_MAN = 0 // 男
export const GENDER_WOMAN = 1 // 女
export const genders = [
  {
    label: '不限',
    value: null
  },
  {
    label: '男',
    value: GENDER_MAN
  },
  {
    label: '女',
    value: GENDER_WOMAN
  }
]

/*
 * 计费模式
 */
export const BILLING_MODE_CPC = 0 // CPC
export const BILLING_MODE_CPM = 1 // CPM
export const billing_modes = [
  {
    label: '按点击付费(CPC)',
    value: BILLING_MODE_CPC
  }
  // {
  //   label: '千人成本付费(CPM)',
  //   value: BILLING_MODE_CPM
  // }
]

/*
生活状态
 */
export const life_status = [
  { label: '求学状态', value: 0 },
  { label: '婚恋状态', value: 1 },
  { label: '职业状态', value: 2 },
  { label: '生育状态', value: 3 },
  { label: '育儿', value: 4 },
  { label: '房产状态', value: 5 },
  { label: '车主状态', value: 6 },
  { label: '旅游', value: 7 }
]

/*
APP行为
 */
export const app_actions = [
  { label: '购物', value: 0 },
  { label: '生活', value: 1 },
  { label: '新闻', value: 2 },
  { label: '音乐', value: 3 },
  { label: '社交', value: 4 },
  { label: '导航', value: 5 },
  { label: '工具', value: 6 },
  { label: '房产', value: 7 },
  { label: '汽车', value: 8 },
  { label: '天气', value: 9 },
  { label: '旅游', value: 10 },
  { label: '体育', value: 11 },
  { label: '娱乐', value: 12 },
  { label: '财务', value: 13 },
  { label: '医疗', value: 14 },
  { label: '图书', value: 15 },
  { label: '儿童', value: 16 },
  { label: '教育', value: 17 },
  { label: '效率', value: 18 },
  { label: '商务', value: 19 },
  { label: '参考', value: 20 },
  { label: '摄影录像', value: 21 },
  { label: '美食佳饮', value: 22 },
  { label: '健康健美', value: 23 },
  { label: '报刊杂志', value: 24 },
  { label: '策略游戏', value: 25 },
  { label: '动作游戏', value: 26 },
  { label: '角色扮演', value: 27 },
  { label: '益智解谜', value: 28 },
  { label: '卡牌游戏', value: 29 },
  { label: '冒险游戏', value: 30 },
  { label: '竞速游戏', value: 31 },
  { label: '体育游戏', value: 32 },
  { label: '模拟游戏', value: 33 },
  { label: '街机游戏', value: 34 },
  { label: '文字游戏', value: 35 },
  { label: '音乐游戏', value: 36 },
  { label: '问答游戏', value: 37 },
  { label: '桌面游戏', value: 38 },
  { label: '儿童游戏', value: 39 },
  { label: '聚会游戏', value: 40 },
  { label: '全部', value: 41 }
]

/*
系统平台
 */
export const systems = [
  { label: 'IOS', value: '-1' },
  { label: 'Android', value: '1' },
  { label: 'PC', value: '2' },
  { label: '其他', value: 3 }
]

/*
网络状态
 */
export const network_status = [
  { label: 'Wi-Fi', value: '1' },
  { label: '2G', value: '2' },
  { label: '3G/4G', value: '3' }
]

/*
手机品牌
 */
export const phone_brands = [
  { value: 90101000, label: '苹果' },
  { value: 90102000, label: 'OPPO' },
  { value: 90103000, label: '小米' },
  { value: 90104000, label: '华为' },
  { value: 90105000, label: 'VIVO' },
  { value: 90106000, label: '三星' },
  { value: 90107000, label: '魅族' },
  { value: 90108000, label: '乐视' },
  { value: 90109000, label: '步步高' },
  { value: 90110000, label: '金立' },
  { value: 90111000, label: '锤子' },
  { value: 90112000, label: '美图' },
  { value: 90113000, label: '360' },
  { value: 90114000, label: '联想' },
  { value: 90115000, label: '黑鲨' },
  { value: 90116000, label: '诺基亚' },
  { value: 90117000, label: '索尼' },
  { value: 90118000, label: '努比亚' },
  { value: 90119000, label: '一加' },
  { value: 90199000, label: '其他' }
]
