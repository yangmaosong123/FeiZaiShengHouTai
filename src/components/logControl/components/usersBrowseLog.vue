<template>
  <div class="users-browse-log">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="企业名称：" class="form-item">
        <el-date-picker
          v-model="form"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" @click="handleQuery()">搜索</el-button>
        <el-button type="info" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        property="account"
        label="用户名">
      </el-table-column>
      <el-table-column
        property="enterpriseName"
        width="156"
        label="企业名称">
      </el-table-column>
      <el-table-column
        property="enterpriseTypeName "
        label="企业类型">
      </el-table-column>
      <el-table-column
        property="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column
        property="email"
        label="联系邮箱">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleLookFirmInfo(scope.row.userId)">查看</el-button>
          <el-button type="warning" size="small" @click="handleFreeze(scope.row.userId)">冻结</el-button>
          <el-button type="success" size="small" @click="handleUnfreeze(scope.row.userId)">解冻</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>


  </div>
</template>
<script>
  export default {
    name: "usersBrowseLog",//用户浏览日志
    data() {
      return {
        form: {},//搜索表单
        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },
      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
    },
    methods: {

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/user/getIsActiveUser",
          data: {
            pageNum: _this.page.pageNum,//页码
            pageSize: _this.page.pageSize,//页条数
            province: "",//省
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.page.total = res.data.data.total;
              _this.tableData = res.data.data.list;
              break;
            case 300:
              _this.$message({
                type: "warning",
                message: res.data.text
              });
              _this.tableData = [];
              break;
          }
        }).catch((err) => {
          console.log(err);
        });
      },

      //分页事件
      handleSizeChange(val) {
        let _this = this;
        _this.page.pageSize = val;
        _this.handleGetTableData(); //获取表数据
      },
      handleCurrentChange(val) {
        let _this = this;
        _this.page.pageNum = val;
        _this.handleGetTableData(); //获取表数据

      },


      //搜索
      handleQuery() {
        let _this = this;
        _this.handleGetTableData(); //获取表数据
      },

      //重置
      handleReset() {
        let _this = this;
        _this.form = {
          startTime: "",
          endTime: "",
        };
      }

    }
  };
</script>
<style lang="less" scoped>
  .users-browse-log {
    margin: 0 10px;
    .form-item {
      display: inline-block;
      padding-top: 10px;
    }
    .pagination {
      padding-left: 33%;
      background: #fff;
      height: 50px;
      padding-top: 10px;
    }
  }
</style>

