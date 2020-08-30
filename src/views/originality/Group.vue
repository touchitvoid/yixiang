<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="关键词">
                <a-input v-model="search.name" placeholder="请输入广告名称或ID" allowClear />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="search.enable" placeholder="请选择" default-value="0" allowClear>
                  <a-select-option :value="1">启用</a-select-option>
                  <a-select-option :value="0">停用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker v-model="search.start_at" style="width: 100%" placeholder="请输入更新日期" />
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="fetchAdverts">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a-divider type="vertical" />
                <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>

      <a-table
        ref="table"
        size="default"
        rowKey="key"
        :columns="columns"
        :data-source="adverts"
        :loading="loading"
        :pagination="page"
        @change="page.current = $event.current"
        showPagination="auto"
      >
        <span slot="switch">
          <a-switch></a-switch>
        </span>
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">添加创意</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">移除</a>
          </template>
        </span>
      </a-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk" />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getRoleList, getServiceList } from '@/api/manage'
import Advert from '../../models/Advert'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: '启用状态',
    key: 'enable',
    dataIndex: 'enable',
    customRender: bool => bool ? '启用' : '停用'
  },
  {
    title: '计划名称',
    key: 'name',
    dataIndex: 'name'
    // scopedSlots: { customRender: 'description' }
  },
  {
    title: '今日展现',
    key: 'daily_view_count',
    dataIndex: 'daily_view_count',
    sorter: true,
    needTotal: true
  },
  {
    title: '今日点击',
    key: 'daily_click_count',
    dataIndex: 'daily_click_count',
    sorter: true,
    needTotal: true,
    customRender: text => text + ' 次'
  },
  {
    title: '今日消耗',
    key: 'daily_consume',
    dataIndex: 'daily_consume'
  },
  {
    title: '点击均价',
    key: 'click_price_avg',
    dataIndex: 'click_price_avg'
  },
  {
    title: '点击率',
    key: 'click_rate',
    dataIndex: 'click_rate'
  },
  {
    title: '出价（元）',
    key: 'price',
    dataIndex: 'price'
  },
  {
    title: '操作',
    key: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  0: {
    status: 'default',
    text: '关闭'
  },
  1: {
    status: 'processing',
    text: '运行中'
  },
  2: {
    status: 'success',
    text: '已上线'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      adverts: [],
      loading: false,
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
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
      selectedRowKeys: [],
      selectedRows: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        opts: [10, 20, 30, 40]
      },
      search: {
        enable: null,
        name: null,
        start_at: null
      }
    }
  },
  watch: {
    'page.current': 'fetchAdverts',
    'page.pageSize': 'fetchAdverts'
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    getRoleList({ t: new Date() })
    this.fetchAdverts()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    async fetchAdverts () {
      try {
        this.loading = true

        const builder = Advert.params({
          page: this.page.current,
          pageSize: this.page.pageSize || 10
        })

        Object.keys(this.search).forEach(k => builder.when(this.search[k] !== null && this.search[k] !== undefined, q => {
          return q.where(k, k === 'start_at' ? this.search[k].format('YYYY-MM-DD') : this.search[k])
        }))

        const { data, meta } = await builder.get()

        this.adverts = data
        this.page.total = meta.total
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    handleAdd () {
      this.mdl = null
      this.$router.push('/originality/group/sheet')
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.id > 0) {
            // 修改 e.g.
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve()
              }, 1000)
            }).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
