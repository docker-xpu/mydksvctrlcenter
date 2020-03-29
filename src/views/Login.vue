<template>
  <div id="login">
    <Logo></Logo>
    <div style="text-align: center">
      <Form algin="center">
        <FormItem>
          <Input v-model="userId" style="width: 200px" size="large" placeholder="用户名"></Input>
        </FormItem>
        <FormItem>
          <Input v-model="password" type="password" style="width: 200px" size="large" placeholder="密码"></Input>
        </FormItem>
        <FormItem>
          <Input v-model="inputCode" style="width: 200px" size="large" placeholder="验证码"></Input>
        </FormItem>
        <FormItem>
          <Identify :identifyCode="identifyCode"></Identify>
          <a @click="refreshCode">
            <Icon type="md-refresh" size="24"></Icon>
          </a>
        </FormItem>
        <FormItem>
          <Button style="width: 200px" size="large" type="primary" @click="handleLogin">登录</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import Logo from "../components/Logo";
  import Identify from "../components/Identify";
  import {userLogin} from '../api/utils';

  export default {
    name: "Login",
    components: {Identify, Logo},
    data() {
      return {
        identifyCodes: "1234567890",
        identifyCode: "",

        inputCode: '',
        userId: '',
        password: ''
      }
    },
    methods: {
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
        }
      },

      handleLogin() {
        if (this.identifyCode === this.inputCode) {
          // login
          userLogin({userId: this.userId, password: this.password}).then(res => {
            if (res.code ===0 ) {
              this.$Message.success(res.msg);
              localStorage.setItem('is_login', true);
              this.$router.push('/home');
            } else {
              this.$Message.error(res.msg);
            }
          });
        } else {
          // message
          this.$Message.error('验证码有误');
        }
      },
    },
    mounted() {
      if (localStorage.getItem('is_login') === 'true') {
        this.$router.push('/Home');
      }

      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    }
  }
</script>

<style scoped>
  #login {
    /*background: #f1f1fe;*/
    position: relative;
    /*border-radius: 10px;*/
    overflow: scroll;
    display: flex;
    min-height: 100vh;
    flex-direction: column;

    /*background-image: url(../assets/homebk2.jpg);*/
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
  }
</style>
