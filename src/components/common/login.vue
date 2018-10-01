<template>
  <div class="login">
    <div class="img-box container">
      <img src="../../assets/img/logo2.png" alt="logo2.png">
    </div>
    <div class="loginBox clearfix main">
      <div class="container">
        <div class="login fr">
          <h2>登录</h2>
          <el-form :model="loginForm"
                   :rules="loginFormRules"
                   ref="loginForm"
                   class="demo-ruleForm login-form">
            <el-form-item prop="username" class="item-form">
              <el-input v-model="loginForm.username"
                        disabled
                        class="item-input"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="item-form">
              <el-input v-model="loginForm.password"
                        type="password"
                        @keyup.enter.native="login('loginForm')"
                        class="item-input"></el-input>
            </el-form-item>
            <el-form-item class="item-form">
              <el-button type="primary"
                         class="button"
                         @click="login('loginForm')"
                         :disabled="controlBtn">登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",//登录
    data() {
      return {
        loginForm: {
          username: "admin",//用户名
          password: "",//用户密码
        },
        //登录验证规则
        loginFormRules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入用户密码', trigger: 'blur'}
          ],
        },
        controlBtn: false,//防止用户多次点击
      };
    },
    methods: {

      // 登录
      login(loginForm) {
        let _this = this;
        _this.$refs[loginForm].validate((valid) => {
          if (valid) {
            _this.controlBtn = true;
            _this.$axios({
              method: "post",
              url: "/user/login",
              withCredentials: true,
              data: {
                account: _this.loginForm.username,
                password: _this.loginForm.password
              }
            }).then(res => {
              switch (res.data.status) {
                case 200:
                  setTimeout(() => {
                    _this.$message({
                      type: "success",
                      message: "登录成功！"
                    });
                    _this.$router.push("/main");
                    _this.$store.state.account = _this.loginForm.username;
                    sessionStorage.setItem('account', _this.$store.state.account);//将用户名保存到localStorage中
                    _this.controlBtn = false;
                  }, 1000);
                  break;
                case 300:
                  _this.$message({
                    type: "warning",
                    message: res.data.text
                  });
                  _this.controlBtn = false;
                  break;
              }
            });
          } else {
            _this.$message({
              type: 'warning',
              message: '带红星的选项为必填项，请返回修改！'
            });
            return false;
          }
        });
      }

    }

  };
</script>

<style lang="less" scoped>
  .login {
    .img-box {
      padding: 30px 0;
      width: 1200px;
    }
    .loginBox {
      background: url(../../assets/img/login-bg.jpg) no-repeat;
      background-size: 100%;
      width: 100% !important;
      padding-top: 60px;
      .container {
        width: 1200px;
        height: 622px;
        margin: 0 auto;
        .login {
          padding: 20px;
          width: 400px;
          height: 340px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #848484;
          margin-top: 70px;
          .login-form {
            margin-top: 30px;
            .item-form {
              margin-top: 20px;
              &:first-child {
                margin-top: 0;
              }
            }
            .button {
              padding: 12px 165px;
            }
          }
        }
      }
    }
  }
</style>


