<template>
  <a-card class="container">
    <div class="form-item">
      <div class="form-title">步骤一</div>
      <Form :label-width="80" label-position="left">
        <FormItem label="关联计划:">
          <Select style="width: 150px" class="selector" placeholder="请选择..." v-model="form.advert_id" clearable>
            <Option v-for="{ id, name } in advertOptions" :value="id" :key="id">{{ name }}</Option>
          </Select>
          <Divider type="vertical" />
          <Button type="success" @click="$router.push({ name: 'ad_sheet' })">新建推广计划</Button>
        </FormItem>
        <FormItem label="优化目标:">
          <RadioGroup type="button" v-model="form.optimize_target">
            <Radio v-for="{ label, value } in optimize_targets" :key="value" :label="value">{{ label }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="投放方式:">
          <RadioGroup type="button" v-model="form.publish_method">
            <Radio v-for="{ label, value } in publish_methods" :key="value" :label="value">{{ label }}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="投放目的:">
          <div
            v-for="item in publish_objectives"
            :key="item.value"
            :class="{ checked: item.value === form.publish_objective }"
            @click.stop="form.publish_objective = item.value"
            class="platform-item"
          >{{ item.label }}</div>
        </FormItem>
      </Form>
    </div>
    <Divider></Divider>
    <div class="form-title">步骤二</div>
    <Form :label-width="80" label-position="left">
      <FormItem label="创意名称:">
        <Input v-model="form.name" class="selector" placeholder="请输入创意名称"></Input>
      </FormItem>
      <FormItem label="网站链接:">
        <Input v-model="form.site_link" class="selector" placeholder="请输入网站链接"></Input>
      </FormItem>
      <FormItem label="广告标题:">
        <Input v-model="form.title" class="selector" placeholder="请输入广告标题"></Input>
      </FormItem>
      <FormItem label="品牌名称:">
        <Input v-model="form.brand_name" class="selector" placeholder="请输入品牌名称"></Input>
      </FormItem>
      <FormItem label="展示类型:">
        <div
          v-for="item in view_types"
          :key="item.value"
          :class="{ checked: item.value === form.view_type }"
          @click.stop="form.view_type = item.value"
          class="platform-item"
        >{{ item.label }}</div>
      </FormItem>
      <FormItem label="创意图片:" :key="currentViewType.value" >
        <Upload :show-upload-list="false" :action="uploadAction" :headers="uploadHeaders" :on-success="handleCoverUploadSuccess">
          <div class="img-cover" :style="currentViewType.style">
            <img class="cover" :src="form.cover || ''" />
          </div>
        </Upload>
        ({{ currentViewType.style.width + '*' + currentViewType.style.height }}，500KB以内，支持 jpg, png, gif)
      </FormItem>
    </Form>
    <Divider></Divider>
    <Button style="margin-right: 12px" @click="$router.push({ name: 'originality' })">取消</Button>
    <Button type="success" @click="handleSubmit">{{ isEdit ? '更新创意' : '新增创意' }}</Button>
  </a-card>
</template>

<script>
import Advert from '../../models/Advert'
import { baseUrl } from '../../libs/api.request'
import {
  optimize_targets,
  publish_methods,
  publish_objectives,
  view_types,
  OPTIMIZE_TARGET_CONVERSION,
  PUBLISH_OBJECTIVE_TRAFFIC_ALLIANCE,
  VIEW_TYPE_640X320,
  PUBLISH_METHOD_COST_FIRST
} from '../../enums/idea'
import Idea from '../../models/Idea'
import store from '../../store'
import _ from 'lodash'
import { mapActions } from 'vuex'

export default {
  name: 'CreatePlan',
  props: {
    advertId: {
      type: Number,
      required: false
    },
    editing: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      advertOptions: [],
      form: {
        advert_id: null,
        optimize_target: OPTIMIZE_TARGET_CONVERSION,
        publish_method: PUBLISH_METHOD_COST_FIRST,
        publish_objective: PUBLISH_OBJECTIVE_TRAFFIC_ALLIANCE,
        view_type: VIEW_TYPE_640X320,
        cover: '',
        name: '',
        title: '',
        site_link: '',
        brand_name: ''
      }
    }
  },
  computed: {
    optimize_targets: () => optimize_targets,
    publish_methods: () => publish_methods,
    publish_objectives: () => publish_objectives,
    view_types: () => view_types,
    uploadHeaders: () => ({ 'Authorization': store.getters.token }),
    currentViewType () {
      return _.find(view_types, { value: this.form.view_type }) || {}
    },
    isEdit () {
      return typeof this.editing === 'number'
    },
    uploadAction: () => baseUrl + '/files/cover'
  },
  watch: {
    advertId: {
      immediate: true,
      handler (id) {
        this.form.advert_id = id
      }
    },
    editing: {
      immediate: true,
      handler: 'fetchEditing'
    }
  },
  async created () {
    await this.fetchAdvertOptions()
  },
  methods: {
    ...mapActions(['fetchCurrentUserInfo']),
    async fetchEditing () {
      if (!this.editing) return

      try {
        this.$Spin.show()
        const idea = await Idea.$find(this.editing)
        this.form = idea
      } catch (e) {
        console.error(e)
        this.$Message.error('数据拉取失败')
        this.$router.back()
      } finally {
        this.$Spin.hide()
      }
    },
    async fetchAdvertOptions () {
      try {
        await this.fetchCurrentUserInfo()

        const { data } = await Advert.select(['id', 'name']).where('user_id', store.state.user.info.id).get()

        this.advertOptions = data
      } catch (e) {
        this.$Message.error('广告数据请求失败')
      }
    },
    async handleSubmit () {
      try {
        await new Idea(this.form).save()
        this.$Message.success(this.isEdit ? '更新成功' : '添加成功')
        this.$router.push({ name: 'originality' })
      } catch (e) {
        console.error(e)
      }
    },
    handleCoverUploadSuccess (response, file, fileList) {
      this.form.cover = response.url
    }
  }
}
</script>

<style lang="less" scoped>
  @input-width: 280px;

  .selector,
  .input {
    width: @input-width;
  }
  .form-title {
    font-size: 17px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
    padding-left: 10px;
    border-left: 4px solid rosybrown;
    margin-bottom: 14px;
  }

  .platform-item {
    width: 100px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 4px;
    box-shadow: 0 10px 21px -1px rgba(0, 0, 0, 0.1);
    display: inline-block;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
    &.checked {
      border: 1px solid #2d8cf0;
      &::after {
        content: "";
        position: absolute;
        top: 5px;
        right: 5px;
        border-radius: 10px;
        background: #2d8cf0;
        width: 8px;
        height: 8px;
      }
    }
  }

  .img-cover {
    border: 1px solid #d8d8d8;
    width: 320px;
    height: 150px;
    transition: all 0.8s;

    img.cover {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    img.cover[src=""],img:not([src]){
      opacity: 0;
    }
  }
</style>
