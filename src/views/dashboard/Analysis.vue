<template>
  <div>
    <a-row :gutter="24">
      <a-col v-for="(item, index) in overviewValues" :key="index" :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" :title="item.label.substr(0, item.label.indexOf('/'))" :total="`¥${item.value}`">
          <a-tooltip :title="item.label" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              /元
            </trend>
          </div>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="点击量分布" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :xl="14" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :loading="loading" :bordered="false" title="点击量分布（日期）" :style="{ height: '100%' }">
            <a-range-picker v-model="date" :style="{width: '256px'}" @change="fetchVisitsStatistics" />
            <bar :height="300" :data="barData2" />
          </a-card>
        </a-col>
        <a-col :xl="10" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" :loading="loading" :bordered="false" title="展示量分布" :style="{ height: '100%' }">
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="375" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend dataKey="item"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>

            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { overviewValues, ideaStatistics, visitsStatistics } from '../../api/statistics'

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment().add(i, 'days').format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词'
  },
  {
    dataIndex: 'count',
    title: '用户数'
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
]
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

const pieScale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%'
}]

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea
  },
  data () {
    return {
      loading: true,
      rankList: [],

      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData: [],
      barData2: [],

      //
      pieScale,
      pieData: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      date: [],
      overviewValues: []
    }
  },
  async created () {
    await this.fetchOverviewValues()
    await this.fetchIdeaStatistics()
    await this.fetchVisitsStatistics()
    this.loading = false
  },
  computed: {
    start_at () {
      var curTime = new Date().getTime()
      var startDate = curTime - (7 * 3600 * 24 * 1000)
      startDate = new Date(startDate)

      return this.formatTime(this.date[0] && this.date[0]._d || startDate)
    },
    end_at () {
      return this.formatTime(this.date[0] && this.date[1]._d || new Date())
    },
  },
  methods: {
    formatTime (date) {
      console.log(date)
      const year = date.getFullYear()
      let month = date.getMonth() + 1; month = month < 10 ? '0' + month : month
      let day = date.getDate(); day = day < 10 ? '0' + day : day
      return year + '-' + month + '-' + day + ' 00:00:00'
    },
    async fetchVisitsStatistics () {
      const { data } = await visitsStatistics({ start_at: this.start_at, end_at: this.end_at })
      this.barData2 = data.options.map((d, index) => (
        {
          x: d,
          y: data.data[0].data[index]
        }
      ))
    },
    async fetchOverviewValues () {
      const { data } = await overviewValues()

      this.overviewValues = data
    },
    async fetchIdeaStatistics () {
      const { data } = await ideaStatistics()
      this.barData = data.map(item => ({
        x: item.name,
        y: item.view_count
      }))
      this.rankList = data.map(({ name, view_count }) => ({
        name,
        total: view_count
      }))
      const source = data.map(item => {
        return {
          item: item.name,
          count: item.view_count+1
        }
      })
      const dv = new DataSet.View().source(source)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      })
      this.pieData = dv.rows
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
