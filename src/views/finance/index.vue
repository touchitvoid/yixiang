<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-item label="选择开始和结束日期">
                <a-range-picker v-model="queryParam.date" style="width: 100%" placeholder="请选择日期" />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
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
    title: '交易编号',
    dataIndex: 'callNo'
  },
  {
    title: '交易时间',
    dataIndex: 'callNo'
  },
  {
    title: '交易类别',
    dataIndex: 'callNo'
  },
  {
    title: '交易方式',
    dataIndex: 'callNo'
  },
  {
    title: '交易金额（元）',
    dataIndex: 'callNo'
  },
  {
    title: '交易状态',
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