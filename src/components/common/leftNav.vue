<template>
  <div class="left-nav">
    <el-menu :default-active="leftActiveIndex"
             :default-openeds="['1','2','3','4','5','6']"
             @select="handleSelect"
             class="el-menu-vertical-demo">
      <el-submenu v-show="showIndex=='1'" index="1">
        <template slot="title">
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1">
            <router-link to="/examineControl">审批管理</router-link>
          </el-menu-item>
          <el-menu-item index="1-2">
            <router-link to="/enterpriseControl">企业管理</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-show="showIndex=='2'" index="2">
        <template slot="title">
          <span>资讯管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="2-1">
            <router-link to="/announcementControl">公告管理</router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/slideShowControl">轮播图管理</router-link>
          </el-menu-item>
          <el-menu-item index="2-3">
            <router-link to="/aboutUs">公司介绍</router-link>
          </el-menu-item>
          <el-menu-item index="2-4">
            <router-link to="/homeInformationManagement">首页信息管理</router-link>
          </el-menu-item>
          <el-menu-item index="2-5">
            <router-link to="/faqProblem">常见问题</router-link>
          </el-menu-item>
          <el-menu-item index="2-6">
            <router-link to="/marketCenterManagement">行情中心</router-link>
          </el-menu-item>
          <el-menu-item index="2-7">
            <router-link to="/advertisingPositionControl">广告位</router-link>
          </el-menu-item>
          <el-menu-item index="2-8">
            <router-link to="/joinUs">加入我们</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-show="showIndex=='3'" index="3">
        <template slot="title">
          <span>订单管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="3-1">
            <router-link to="/wasteOrdersControl">危废订单管理</router-link>
          </el-menu-item>
          <el-menu-item index="3-2">
            <router-link to="/recoverableOrderControl">可回收订单管理</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-show="showIndex=='4'" index="4">
        <template slot="title">
          <span>交易管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="4-1">
            <router-link to="/platformIncome">平台收入</router-link>
          </el-menu-item>
          <el-menu-item index="4-2">
            <router-link to="/platformExpend">平台支出</router-link>
          </el-menu-item>
          <el-menu-item index="4-3">
            <router-link to="/platformFundsTrusteeship">平台资金托管</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-show="showIndex=='5'" index="5">
        <template slot="title">
          <span>数据分析</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="5-1">
            <router-link to="/usersBrowseLog">用户数据分析</router-link>
          </el-menu-item>
          <el-menu-item index="5-2">
            <router-link to="/errorLog">系统数据分析</router-link>
          </el-menu-item>

        </el-menu-item-group>
      </el-submenu>
      <el-submenu v-show="showIndex=='6'" index="6">
        <template slot="title">
          <span>系统设置</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="6-1">
            <router-link to="/config">系统设置</router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </div>
</template>
<script>
  import Event from '../../assets/js/event'

  export default {
    name: "leftNav",//左侧边栏导航
    data() {
      return {
        leftActiveIndex: "1-1",//导航--index
        showIndex: '1'
      };
    },
    created() {
      let _this = this;
      if (!localStorage.getItem("leftActiveIndex"))
        _this.handleSelect('1-1');
    },
    mounted() {
      let _this = this;
      _this.showIndex = localStorage.getItem("activeIndex");
      _this.leftActiveIndex = localStorage.getItem("leftActiveIndex");
      Event.$on('value', key => {
        _this.showIndex = key;
        _this.switchCommon();
      });//接收头部点击导航--对应显示相关模块
      _this.switchCommon();
    },
    methods: {
      handleSelect(key) {
        let _this = this;
        _this.leftActiveIndex = key;
        localStorage.setItem('leftActiveIndex', _this.leftActiveIndex)
      },

      switchCommon() {
        let _this = this;
        switch (_this.showIndex) {
          case '1':
            if (_this.leftActiveIndex == '1-1')
              _this.$router.push("/examineControl");
            else if (_this.leftActiveIndex == '1-2')
              _this.$router.push("/enterpriseControl");
            else {
              _this.leftActiveIndex = '1-1';
              localStorage.setItem('leftActiveIndex', _this.leftActiveIndex);
              _this.$router.push("/examineControl");
            }
            console.log(" _this.leftActiveIndex ", _this.leftActiveIndex);
            break;
          case '2':
            if (_this.leftActiveIndex == '2-1')
              _this.$router.push("/announcementControl");
            else if (_this.leftActiveIndex == '2-2')
              _this.$router.push("/slideShowControl");
            else if (_this.leftActiveIndex == '2-3')
              _this.$router.push("/aboutUs");
            else if (_this.leftActiveIndex == '2-4')
              _this.$router.push("/homeInformationManagement");
            else if (_this.leftActiveIndex == '2-5')
              _this.$router.push("/faqProblem");
            else if (_this.leftActiveIndex == '2-6')
              _this.$router.push("/marketCenterManagement");
            else if (_this.leftActiveIndex == '2-7')
              _this.$router.push("/advertisingPositionControl");
            else if (_this.leftActiveIndex == '2-8')
              _this.$router.push("/joinUs");
            else {
              _this.leftActiveIndex = '2-1';
              localStorage.setItem('leftActiveIndex', _this.leftActiveIndex);
              _this.$router.push("/announcementControl");
            }
            break;
          case '3':
            if (_this.leftActiveIndex == '3-1')
              _this.$router.push("/wasteOrdersControl");
            else if (_this.leftActiveIndex == '3-2')
              _this.$router.push("/recoverableOrderControl");
            else {
              _this.leftActiveIndex = '3-1';
              localStorage.setItem('leftActiveIndex', _this.leftActiveIndex);
              _this.$router.push("/wasteOrdersControl");
            }
            break;
          case '4':
            if (_this.leftActiveIndex == '4-1')
              _this.$router.push("/platformIncome");
            else if (_this.leftActiveIndex == '4-2')
              _this.$router.push("/platformExpend");
            else if (_this.leftActiveIndex == '4-3')
              _this.$router.push("/platformFundsTrusteeship");
            else {
              _this.leftActiveIndex = '4-1';
              localStorage.setItem('leftActiveIndex', _this.leftActiveIndex);
              _this.$router.push("/platformIncome");
            }
            break;
          case '5':
            if (_this.leftActiveIndex == '5-1')
              _this.$router.push("/usersBrowseLog");
            else if (_this.leftActiveIndex == '5-2')
              _this.$router.push("/errorLog");
            else {
              _this.leftActiveIndex = '5-1';
              localStorage.setItem('leftActiveIndex', _this.leftActiveIndex);
              _this.$router.push("/usersBrowseLog");
            }
            break;
          case '6':
            if (_this.leftActiveIndex == '6-1')
              _this.$router.push("/config");
            else {
              _this.leftActiveIndex = '6-1';
              localStorage.setItem('leftActiveIndex', _this.leftActiveIndex);
              _this.$router.push("/config");
            }
            break;
        }
      },
    }
  };
</script>
<style lang="less" scoped>
  .left-nav {
    background: #fff;
    @media screen and (max-width: 1366px) {
      & {
        height: 768px;
      }
    }
    @media screen and (max-width: 1920px) {
      & {
        height: 1080px;
      }
    }
    .el-menu-vertical-demo {
      width: 160px;
    }
    .el-submenu .el-menu-item {
      padding: 0 0 !important;
      min-width: 160px;
      height: 100%;
      a {
        display: inline-block !important;
        width: 160px !important;
        text-align: center !important;
      }
    }

    .el-menu-item.is-active {
      background-color: #198df2 !important;
      a {
        color: #f3f3f3;
      }
    }
  }
</style>
