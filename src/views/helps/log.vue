<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-table 
      ref="table" 
      size="default" 
      rowKey="key" 
      :columns="columns" 
      :data-source="tableData" 
      showPagination="auto">
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import LoginLog from '../../models/LoginLog'
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'

const columns = [
  {
    title: '登录时间',
    dataIndex: 'created_at'
  },
  {
    title: 'IP',
    dataIndex: 'ip_address'
  },
  {
    title: '设备',
    dataIndex: 'equipment'
  },
  {
    title: '操作系统',
    dataIndex: 'os'
  },
  {
    title: '登录所属',
    dataIndex: 'user.id',
    customRender: value => value.user.id
  }
]

export default {
  name: 'LOg',
  components: {
    STable,
    Ellipsis
  },
  data() {
    this.columns = columns
    return {
      loading: false,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        opts: [10, 20, 30, 40]
      },
      tableData: [],
      // 查询参数
      search: {}
      // 加载数据方法 必须为 Promise 对象
    }
  },
  created() {
    this.fetchLogs()
  },
  methods: {
    async fetchLogs() {
      try {
        this.loading = true

        const builder = LoginLog.params({
          page: this.page.current,
          pageSize: this.page.pageSize || 10
        }).include('user')

        Object.keys(this.search).forEach(k =>
          builder.when(this.search[k] !== null && this.search[k] !== undefined, q => q.where(k, this.search[k]))
        )

        const { data, meta } = await builder.get()

        this.logs = data
        this.page.total = meta.total
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
