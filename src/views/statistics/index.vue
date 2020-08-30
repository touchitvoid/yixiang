<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-item label="创建日期">
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
      <Bar :data="barData" />
      <s-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data="loadData"
        :showPagination="false"
      >
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import { Bar } from '@/components'

const columns = [
  {
    title: '统计日期',
    dataIndex: 'callNo'
  },
  {
    title: '曝光量',
    dataIndex: 'callNo'
  },
  {
    title: '点击量',
    dataIndex: 'callNo'
  },
  {
    title: '点击率',
    dataIndex: 'callNo'
  },
  {
    title: '平均点击均价（元）',
    dataIndex: 'callNo'
  },
  {
    title: '总消费（元）',
    dataIndex: 'callNo'
  }
]

const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

export default {
  name: 'Statistics',
  components: {
    STable,
    Ellipsis,
    Bar
  },
  data() {
    this.columns = columns
    return {
      barData,
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