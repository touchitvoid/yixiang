<template>
  <div style="display: inline-block">
    <a-radio-group v-model="state">
      <a-radio label="false">{{ trueLabel }}</a-radio>
      <a-radio label="true">{{ falseLabel }}</a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  name: 'BoolRadio',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    trueLabel: {
      type: String,
      default: '不限'
    },
    falseLabel: {
      type: String,
      default: '限制'
    }
  },
  data () {
    return {
      state: 'true'
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (bool) {
        this.state = bool ? 'true' : 'false'
      }
    },
    state (state) {
      this.$emit('input', state === 'true')
    }
  }
}
</script>

<style scoped>

</style>
