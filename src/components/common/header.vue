<template>
  <div class="header">
    <div class="container">
      <el-row>
        <el-col :span="2">
          <img src="../../assets/img/logo.png" alt="logo">
        </el-col>
        <el-col :span="19" class="menu">
          <el-menu :default-active="activeIndex" text-color="#fff"
                   active-text-color="#ffd04b"
                   background-color="rgba(0,0,0,0)"
                   class="el-menu-demo"
                   mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">用户管理</el-menu-item>
            <el-menu-item index="2">资讯管理</el-menu-item>
            <el-menu-item index="3">订单管理</el-menu-item>
            <!--<el-menu-item index="4">交易管理</el-menu-item>-->
            <el-menu-item index="5">数据管理</el-menu-item>
            <el-menu-item index="6">系统设置</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="3" class="username">
          <span>{{$store.state.account?$store.state.account:$store.getters.getAccount}}</span>
          <el-button type="text" style="color:rgb(162, 220, 255);" @click="handleGoOut">退出</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Event from '../../assets/js/event'

  export default {
    name: 'header',//页头
    data() {
      return {
        activeIndex: '1'
      };
    },
    created() {
      let _this = this;
      if (!localStorage.getItem("activeIndex"))
        _this.handleSelect('1');
    },
    mounted() {
      let _this = this;
      _this.activeIndex = localStorage.getItem("activeIndex");
    },
    methods: {

      handleSelect(key) {
        let _this = this;
        console.log(key);
        Event.$emit('value', key);//将当前点击的路由传递给左侧导航
        _this.activeIndex = key;
        localStorage.setItem('activeIndex', _this.activeIndex)
      },

      // 退出登录
      handleGoOut() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/user/loginBack",
        }).then((res) => {
          if (res.data.status === 200) {
            _this.$message({
              type: 'success',
              message: '退出成功！',
              duration: 500
            });
            setTimeout(() => {
              _this.$router.push("/");
              _this.$store.state.account = "";
              sessionStorage.setItem('account', "");
            }, 1000);
          }
        })
      },
    }

  };

</script>
<style lang="less" scoped>
  .header {
    height: 60px;
    background: #198df2;
    .menu {
      padding-left: 50px;
    }
    .username {
      line-height: 60px;
      color: #fff;
      // padding-left: 80px;
      span {
        margin-right: 3px;
        padding-right: 10px;
        border-right: 2px solid #fff;
      }
    }
  }
</style>

