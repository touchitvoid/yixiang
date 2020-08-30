<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-item label="创建日期">
                <a-range-picker v-model="queryParam.date" @change="fetchVisitsStatistics" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <Bar :data="barData" />
      <s-table ref="table" size="default" rowKey="key" :columns="columns" :data="loadData" :showPagination="false">
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { Bar } from '@/components'
import { visitsTable, visitsStatistics} from '../../api/statistics'

const columns = [
  {
    title: '统计日期',
    dataIndex: 'date'
  },
  {
    title: '曝光量',
    dataIndex: 'viewCount'
  },
  {
    title: '点击量',
    dataIndex: 'clickCount'
  },
  {
    title: '点击率',
    dataIndex: 'clickRate'
  },
  {
    title: '平均点击均价（元）',
    dataIndex: 'clickConsumeAvg'
  },
  {
    title: '总消费（元）',
    dataIndex: 'consume'
  }
]

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
      tableData: [],
      barData: [],
      // 查询参数
      queryParam: {
        date: []
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: async parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return visitsTable({...requestParameters,
          start_at: this.startAt, end_at: this.endAt 
        }).then(res => {
          return res
        })
      }
    }
  },
  created() {
    this.fetchVisitsStatistics()
  },
  computed: {
    startAt () {
      var curTime = new Date().getTime()
      var startDate = curTime - (7 * 3600 * 24 * 1000)
      startDate = new Date(startDate)

      return this.formatTime(this.queryParam.date[0]&& this.queryParam.date[0]._d || startDate)
    },
    endAt () {
      return this.formatTime(this.queryParam.date[1]&& this.queryParam.date[1]._d || new Date())
    }
  },
  methods: {
    async fetchVisitsStatistics () {
      const { data } = await visitsStatistics({ start_at: this.startAt, end_at: this.endAt })
      this.barData = data.options.map((d, index) => (
        {
          x: d,
          y: data.data[0].data[index]
        }
      ))
    },
    formatTime(date) {
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day + ' 00:00:00'
    },
    async fetchTableData() {
      try {
        this.loading = true

        const { data } = await visitsTable({ start_at: this.startAt, end_at: this.endAt })

        this.tableData = data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cover-img {
  max-height: 90px;
}
</style>
