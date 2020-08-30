<template>
  <div style="display: inline-block">
    <RadioGroup v-model="state">
      <Radio label="false">{{ trueLabel }}</Radio>
      <Radio label="true">{{ falseLabel }}</Radio>
    </RadioGroup>
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
