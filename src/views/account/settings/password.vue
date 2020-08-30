<template>
  <div>
    <a-form>
      <a-form-item label="公司名称">
        <a-input style="width: 280px" placeholder="请输入" /><a-divider type="vertical" />
        <a-button type="primary">获取验证码</a-button>
      </a-form-item>
      <a-form-item label="新密码">
        <a-input style="width: 340px" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="确认新密码">
        <a-input style="width: 340px" placeholder="请输入" />
      </a-form-item>
      <a-button type="primary">保存新密码</a-button>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'Password',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
