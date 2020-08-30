<template>
  <a-card class="container">
    <div class="form-item">
      <div class="form-title">计划名称</div>
      <a-input v-model="formData.name" style="width: 500px;display: block;margin-bottom: 15px" placeholder="请输入计划名称" />
    </div>
    <a-divider></a-divider>
    <div class="form-title">用户属性</div>
    <a-form :label-width="80" label-position="left">
      <a-form-item label="年龄:">
        <bool-radio v-model="formData.limit_age" false-label="自定义"></bool-radio>
        <div style="display: inline-block" v-show="formData.limit_age">
          <a-input-number v-model="formData.age_min" placeholder="请输入" size="small" :max="99" :min="1" style="margin-left: 8px"></a-input-number>
          -
          <a-input-number v-model="formData.age_max" placeholder="请输入" size="small" :max="99" :min="1"></a-input-number>
        </div>
      </a-form-item>
      <a-form-item label="性别:">
        <a-radio v-model="formData.gender">
          <a-radio
            v-for="(item, index) in genders"
            :key="index"
            :label="item.value"
          >{{ item.label }}</a-radio>
        </a-radio>
      </a-form-item>
      <a-form-item label="地域:">
        <bool-radio v-model="formData.limit_address" false-label="省市区"></bool-radio>
        <div class="area-card__group" v-show="formData.limit_address">
          <div class="area-tree">
            <a-tree @on-check-change="handleSelectArea" :data="AreaData" show-checkbox></a-tree>
          </div>
          <div class="area-result">
            <a-tree  @on-check-change="handleCancelSelect" :data="AreaResult" show-checkbox></a-tree>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="人生状态:">
        <bool-radio v-model="formData.limit_human_state" false-label="人生状态分类"></bool-radio>
        <div v-show="formData.limit_human_state">
          全部人生状态
          <a-button size="small" style="margin-left: 5px" @click="handleVisible('life')">更改</a-button>
        </div>
      </a-form-item>
      <a-form-item label="投放平台:">
        <a-checkbox-group v-model="formData.push_platform">
          <a-checkbox
            v-for="(item, index) in systems"
            :key="index"
            :label="item.value"
          >{{ item.label }}</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="App行为:">
        <bool-radio v-model="formData.limit_app_action" false-label="按类别"></bool-radio>
        <div v-show="formData.limit_app_action">
          <a-button size="small" style="margin-left: 5px" @click="handleVisible('app')">更改</a-button>
        </div>
      </a-form-item>
      <a-form-item label="网络:">
        <a-checkbox-group v-model="formData.network_state">
          <a-checkbox
            v-for="(item, index) in network_status"
            :key="index"
            :label="item.value"
          >{{ item.label }}</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="手机品牌:">
        <bool-radio v-model="formData.limit_phone_brand" false-label="选择品牌"></bool-radio>
        <div v-show="formData.limit_phone_brand">
          <a-button @click.stop="handleVisible('brand')" style="margin-left: 6px;" size="small">更改</a-button>
        </div>
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <div class="form-title">预算与排期</div>
    <a-form :label-width="80" label-position="left">
      <a-form-item label="单日预算:">
        <bool-radio v-model="formData.limit_daily_budget" false-label="自定义"></bool-radio>
        <a-input v-show="formData.limit_daily_budget" v-model="formData.daily_budget" placeholder="不低于50元" />
      </a-form-item>
      <a-form-item label="投放排期:">
        <bool-radio v-model="formData.limit_publish_date" true-label="从今天起开始长期投放( 当前时间 )" false-label="设置起始和结束时间"></bool-radio>
        <a-date-picker v-show="formData.limit_publish_date" :value="[formData.publish_start_at, formData.publish_end_at]" @on-change="handlePublishDateChange" type="daterange" placeholder="Select date" style="width: 200px"></a-date-picker>
      </a-form-item>
      <a-form-item label="投放时段:">
        <bool-radio v-model="formData.limit_publish_time" true-label="全时间段" false-label="特定时间段"></bool-radio>
        <a-time-picker v-if="formData.limit_publish_time" :value="[formData.daily_publish_start_at, formData.daily_publish_end_at]" @on-change="handleDailyPublishTimeChange" format="HH:mm:ss" type="timerange" placeholder="选择开始时间和结束时间" style="width: 240px"></a-time-picker>
      </a-form-item>
      <a-form-item label="计费模式:">
        <a-radio-group vertical v-model="formData.billing_mode">
          <a-radio v-for="{ label, value } in billing_modes" :key="value" :label="value">{{ label }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="点击出价:" v-if="formData.billing_mode === BILLING_MODE_CPC">
        <a-input v-model="formData.price" class="selector" placeholder="请输入点击出价"></a-input>
      </a-form-item>
      <a-form-item label="设置出价:" v-if="formData.billing_mode === BILLING_MODE_CPM">
        <a-input v-model="formData.price" class="selector" placeholder="为保证优质流量高触达率，建议出价不低于25元" style="margin-right: 7px"></a-input>元/千次曝光
      </a-form-item>
    </a-form>
    <a-divider></a-divider>
    <a-button style="margin-right: 12px">取消</a-button>
    <a-button type="success" @click="handleSubmit">{{ isEdit ? '保存计划' : '新增计划' }}</a-button>
    <a-modal title="更改人生状态" v-model="visible">
      <a-checkbox-group v-if="modalKey==='life'" v-model="formData.human_state">
        <a-checkbox
          style="margin: 0 15px 15px 0"
          v-for="(item, index) in life_status"
          :key="index"
          :label="item.value"
        >{{ item.label }}</a-checkbox>
      </a-checkbox-group>
      <a-checkbox-group v-if="modalKey==='app'" v-model="formData.app_action">
        <a-checkbox
          style="margin: 0 15px 15px 0"
          v-for="(item, index) in app_actions"
          :key="index"
          :label="item.value"
        >{{ item.label }}</a-checkbox>
      </a-checkbox-group>
      <a-checkbox-group v-if="modalKey==='brand'" v-model="formData.phone_brand">
        <a-checkbox
          style="margin: 0 15px 15px 0"
          v-for="(item, index) in phone_brands"
          :key="index"
          :label="item.value"
        >{{ item.label }}</a-checkbox>
      </a-checkbox-group>
    </a-modal>
  </a-card>
</template>

<script>
import AreaData from './level.json'
import Advert from '../../models/Advert'
import {
  genders,
  billing_modes,
  life_status,
  app_actions,
  systems,
  network_status,
  phone_brands,
  BILLING_MODE_CPC,
  BILLING_MODE_CPM
} from '../../enums/advert'
import BoolRadio from './components/BoolRadio'

export default {
  name: 'CreatePlan',
  components: { BoolRadio },
  props: {
    editing: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      AreaResult: [],
      visible: false,

      modalKey: null,
      formData: {
        name: '',
        age_min: null,
        age_max: null,
        gender: null,

        addresses: [],
        human_state: [],
        push_platform: [],
        app_action: [],
        network_state: [],
        phone_brand: [],

        publish_start_at: null,
        publish_end_at: null,

        daily_budget: 0,
        daily_publish_start_at: null,
        daily_publish_end_at: null,
        billing_mode: BILLING_MODE_CPC,
        price: null,

        limit_age: false,
        limit_address: false,
        limit_human_state: false,
        limit_app_action: false,
        limit_phone_brand: false,
        limit_daily_budget: false,
        limit_publish_date: false,
        limit_publish_time: false
      }
    }
  },
  computed: {
    AreaData: () => AreaData,
    BILLING_MODE_CPC: () => BILLING_MODE_CPC,
    BILLING_MODE_CPM: () => BILLING_MODE_CPM,
    billing_modes: () => billing_modes,
    life_status: () => life_status,
    genders: () => genders,
    app_actions: () => app_actions,
    systems: () => systems,
    network_status: () => network_status,
    phone_brands: () => phone_brands,
    isEdit () {
      return this.editing !== undefined
    }
  },
  watch: {
    editing: {
      immediate: true,
      handler: 'fetchEditing'
    }
  },
  mounted () {},
  methods: {
    async fetchEditing () {
      if (!this.editing) return

      try {
        this.$Spin.show()

        const advert = await Advert.$find(this.editing)

        this.formData = advert
      } catch (e) {
        console.error(e)
      } finally {
        this.$Spin.hide()
      }
    },
    handleVisible (key) {
      this.modalKey = key
      this.visible = true
    },
    handleSelectArea (selectArr) {
      this.formData.addresses = selectArr.map(address => address.code)
      console.time('Calc')
      let result = []
      selectArr.forEach(item => {
        let province = AreaData.findIndex(f => f.province === item.province)
        if (province >= 0 && !result.includes(province)) {
          result.push(province)
        }
      })
      let resultArr = []
      for (let i = 0; i < result.length; i++) {
        resultArr.push({ ...this.AreaData[result[i]], expand: false })
      }
      this.$set(this.$data, 'AreaResult', JSON.parse(JSON.stringify(resultArr)))
      console.timeEnd('Calc')
    },
    // 取消选中
    handleCancelSelect () {
      let cancelArr = JSON.parse(JSON.stringify(this.AreaResult))
      console.log(this.AreaResult)
      for (let i = 0; i < cancelArr.length; i++) {
        let province = AreaData.findIndex(fi => fi.province === cancelArr[i].province)
        this.$set(this.AreaData, province, Object.assign({}, cancelArr[i], { expand: false }))
      }
      this.AreaResult = this.AreaResult.filter(item => item.checked || item.indeterminate)
    },
    async handleSubmit () {
      try {
        await new Advert(this.formData).save()
        this.$Message.success(this.isEdit ? '编辑成功' : '添加成功')
        this.$router.push({ name: 'ad' })
      } catch (e) {
        console.error(e)
      }
    },
    handleDailyPublishTimeChange ([start, end]) {
      this.formData.daily_publish_start_at = start
      this.formData.daily_publish_end_at = end
    },
    handlePublishDateChange ([start, end]) {
      this.formData.publish_start_at = start
      this.formData.publish_end_at = end
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
.area-card__group {
  > div {
    width: 200px;
    height: 280px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: inline-block;
    margin-right: 12px;
    box-sizing: border-box;
    padding: 16px 14px;
    overflow-y: auto;
  }
}
.brand {
  display: -webkit-flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
}
</style>
