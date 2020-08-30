<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="广告计划">
                <a-select placeholder="请选择" allowClear v-model="search.advert_id">
                  <a-select-option v-for="{ id, name } in advertOptions" :key="id" :value="id">{{ name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="关键字">
                <a-input placeholder="请输入广告名称或ID" allowClear v-model="search.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="创建日期">
                <a-date-picker v-model="search.created_at" style="width: 100%" placeholder="请输入创建日期" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
              >
                <a-button type="primary" @click="fetchIdeas">查询</a-button>
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
        :data-source="ideas"
        :loading="loading"
        :pagination="page"
        @change="page.current = $event.current"
        showPagination="auto"
      >
        <div slot="enable" slot-scope="text, record">
          <a-switch default-checked @change="handleChangeEnable($event, record)" />
        </div>

        <span slot="switch">
          <a-switch></a-switch>
        </span>
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">移除</a>
          </template>
        </span>

        <span slot="cover" slot-scope="text, record">
          <img class="cover-img" :src="text" alt="">
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

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

import Advert from '../../models/Advert'
import Idea from '../../models/Idea'

const columns = [
  {
    title: '开关',
    dataIndex: 'enable',
    key: 'enable',
    scopedSlots: { customRender: 'enable' }
  },
  {
    title: '审核状态',
    dataIndex: 'verify_success',
    key: 'verify_success',
    customRender: bool => bool ? '已审核' : '未审核'
  },
  {
    title: '广告计划',
    dataIndex: 'advert.name',
    key: 'advert.name'
  },
  {
    title: '创意名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '广告标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '创意预览',
    dataIndex: 'cover',
    key: 'cover',
    scopedSlots: { customRender: 'cover' }
  },
  {
    title: '消耗',
    dataIndex: 'all_consume',
    key: 'all_consume'
  },
  {
    title: '展示数',
    dataIndex: 'all_view_count',
    key: 'all_view_count'
  },
  {
    title: '点击数',
    dataIndex: 'all_click_count',
    key: 'all_click_count'
  },
  {
    title: '平均点击单价',
    dataIndex: 'avg_click_price',
    key: 'avg_click_price'
  },
  {
    title: '点击率',
    dataIndex: 'click_rate',
    key: 'click_rate'
  },
  {
    title: '投放时间',
    dataIndex: 'publish_at',
    key: 'publish_at'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at'
  },
  {
    title: '操作',
    dataIndex: 'action',
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
      advertOptions: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        opts: [10, 20, 30, 40]
      },
      search: {
        advert_id: null,
        name: null,
        created_at: null
      },
      ideas: [],
      loading: false
    }
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
    this.fetchAdvertOptions()
    if (this.$route.params.advert_id) {
      this.search.advert_id = this.$route.params.advert_id
    }
    this.fetchIdeas()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  watch: {
    'page.current': 'fetchIdeas',
    'page.pageSize': 'fetchIdeas'
  },
  methods: {
    async handleChangeEnable (value, row) {
      const idea = new Idea({ id: row.id })
      idea.enable = value
      await idea.save()
      this.$Message.success('更新状态成功')
    },
    async fetchAdvertOptions () {
      const { data } = await Advert.select(['id', 'name']).get()

      this.advertOptions = data
    },
    async fetchIdeas () {
      try {
        this.loading = true

        const builder = Idea.params({
          page: this.page.current,
          pageSize: this.page.pageSize || 10
        }).include('advert')

        Object.keys(this.search).forEach(k => builder.when(this.search[k] !== null && this.search[k] !== undefined, q => {
          return q.where(k, k === 'created_at' ? this.search[k].format('YYYY-MM-DD') : this.search[k])
        }))

        const { data, meta } = await builder.get()

        this.ideas = data
        this.page.total = meta.total
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    handleAdd () {
      this.mdl = null
      this.$router.push('/originality/sheet')
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
      this.$router.push({ name: 'OriginalitySheet', params: { editing: record.id } })
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
      this.$Modal.confirm({
        title: '删除创意计划',
        content: '确认要删除这条创意计划吗',
        okText: '是的',
        cancelText: '取消',
        onOk: async () => {
          try {
            await new Idea({ id: record.id }).delete()
            this.$Message.success('删除成功')
            this.fetchIdeas()
          } catch (e) {
            console.error(e)
          }
        }
      })
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

<style lang="less" scoped>
  .cover-img {
    max-height: 90px;
  }
</style>
