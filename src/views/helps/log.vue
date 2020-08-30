<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'

const columns = [
  {
    title: '登录时间',
    dataIndex: 'callNo'
  },
  {
    title: 'IP',
    dataIndex: 'callNo'
  },
  {
    title: '设备',
    dataIndex: 'callNo'
  },
  {
    title: '操作系统',
    dataIndex: 'callNo'
  },
  {
    title: '登录所属',
    dataIndex: 'callNo'
  }
]


export default {
  name: 'Finance',
  components: {
    STable,
    Ellipsis
  },
  data() {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters).then(res => {
          return res.result
        })
      },
    }
  },
  created() {
    getRoleList({ t: new Date() })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  .cover-img {
    max-height: 90px;
  }
</style>