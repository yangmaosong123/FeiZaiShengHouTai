<template>
  <div class="main">
    <el-row>
      <el-col :span="24">
        <Header></Header>
      </el-col>
    </el-row>
    <el-container>
      <el-aside width="160px">
        <LeftNav></LeftNav>
      </el-aside>
      <el-main style="padding:0;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script>
  import Header from './header'
  import LeftNav from './leftNav'

  export default {
    name: 'main',//主页
    components: {
      Header,//页头
      LeftNav,//页头
    }
  };
</script>
<style lang="less" scoped>

</style>
