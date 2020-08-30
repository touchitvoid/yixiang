<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-item label="选择开始和结束日期">
                <a-range-picker v-model="queryParam.date" @change="fetchTableData" valueFormat="YYYY-MM-DD" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table 
        ref="table" 
        size="default" 
        rowKey="key"
        :loading="loading"
        :columns="columns" 
        :data-source="tableData" 
        showPagination="auto"
        :pagination="page"
        @change="page.current = $event.current"
        >
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import Finance from '../../models/Finance'

const columns = [
  {
    title: '交易编号',
    dataIndex: 'number'
  },
  {
    title: '交易时间',
    dataIndex: 'created_at'
  },
  {
    title: '交易类别',
    dataIndex: 'type'
  },
  {
    title: '交易方式',
    dataIndex: 'method'
  },
  {
    title: '交易金额（元）',
    dataIndex: 'amount'
  },
  {
    title: '交易状态',
    dataIndex: 'state'
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
      queryParam: {
        date: []
      },
      tableData: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        opts: [10, 20, 30, 40]
      },
      loading: false
      // 加载数据方法 必须为 Promise 对象
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    async fetchTableData() {
      try {
        this.loading = true
        const params = {
          page: this.page.current,
          pageSize: this.page.pageSize || 10
        }

        if (this.queryParam.date) {
          params.start_at = this.queryParam.date[0]
        }

        if (this.queryParam.date) {
          params.end_at = this.queryParam.date[1]
        }

        const builder = Finance.params(params)

        const { data, meta } = await builder.get()

        this.tableData = data
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
