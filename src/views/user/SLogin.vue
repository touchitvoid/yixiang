<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-form">
        <div class="login-title">Sign Up</div>
        <div class="login-form__body">
          <div>
            登录账户
            <input v-model="loginParams.username" placeholder="请输入" type="text" />
          </div>
          <div>
            输入密码
            <input v-model="loginParams.password" placeholder="请输入" type="password" />
          </div>
          <button @click="handleLogin">
            <span>登录</span>
          </button>
        </div>
      </div>
      <div class="login-bg"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  name: 'Login',
  data () {
    return {
      loginParams: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(['Login']),

    handleLogin () {
      const { username, password } = this.loginParams
      if (!username) {
        return this.$message.error('请输入用户名')
      }
      if (!password) {
        return this.$message.error('请输入密码')
      }
      const hide = this.$message.loading('正在登录', 0)
      this.Login(this.loginParams)
        .then(res => this.loginSuccess(res))
        .catch(err => console.error(err))
        .finally(() => {
          hide()
        })
    },
    loginSuccess (res) {
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(90deg, #5b60ef, #306af8);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  .login-box {
    width: 1300px;
    height: 780px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    display: -webkit-flex;
    .login-form {
      flex-basis: 550px;
      padding: 0 90px;
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: left;
      width: 100%;
      .login-title {
        width: 100%;
        text-align: left;
        font-size: 42px;
        color: #2638b8;
        margin-bottom: 20px;
        font-weight: bold;
      }
      .login-form__body {
        width: 100%;
        text-align: left;
        > div {
          font-size: 18px;
          margin-top: 36px;
          input {
            height: 40px;
            width: 100%;
            color: #4f64f7;
            border: none;
            outline: none;
            border-bottom: 1px solid #999;
            margin-top: 2px;
          }
        }
        button {
          width: 174px;
          height: 62px;
          background: #4c64f7;
          border-radius: 62px;
          border: none;
          font-size: 25px;
          color: white;
          position: relative;
          z-index: 2;
          outline: none;
          margin-top: 85px;
          span {
            position: relative;
            z-index: 2;
          }
          &::before {
            content: '';
            width: 100%;
            height: 100%;
            background: inherit;
            filter: blur(4px);
            position: absolute;
            top: 1px;
            left: 0;
            border-radius: inherit;
            z-index: 1;
            opacity: 0.7;
          }
        }
      }
    }
    .login-bg {
      flex: 1;
      background-color: white;
      background: url('../../assets/bg.png') no-repeat center / cover;
    }
  }
}
</style>
