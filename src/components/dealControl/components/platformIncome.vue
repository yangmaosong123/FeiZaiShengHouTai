<template>
  <div class="platform-income">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="缴费企业：" class="form-item">
        <el-input v-model="form.enterpriseName" placeholder="请输入缴费企业"></el-input>
      </el-form-item>
      <el-form-item label="交易流水号：" class="form-item">
        <el-input v-model="form.enterpriseName" placeholder="请输入交易流水号"></el-input>
      </el-form-item>
      <el-form-item label="收入类型：" class="form-item">
        <el-select v-model="form.enterpriseType" placeholder="请选择收入类型">
          <el-option :label="item.label" :value="item.value" v-for="item in form.enterpriseOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区：" class="form-item">
        <el-select v-model="form.enterpriseType" placeholder="请选择种类">
          <el-option :label="item.label" :value="item.value" v-for="item in form.enterpriseOptions"></el-option>
        </el-select>
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
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        property="account"
        label="缴费企业">
      </el-table-column>
      <el-table-column
        property="enterpriseName"
        width="156"
        label="收入类型">
      </el-table-column>
      <el-table-column
        property="enterpriseTypeName "
        label="交易流水号">
      </el-table-column>
      <el-table-column
        property="phone"
        label="地区">
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
    name: "platformIncome",//平台收入
    data() {
      return {
        form: {},//搜索表单
        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        }
      };
    },
    created() {
      this.handleGetTableData(); //获取表数据
    },
    methods: {

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "",
          data: {
            pageNum: _this.page.pageNum,//页码
            pageSize: _this.page.pageSize,//页条数
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
        })
      },

      //分页事件
      handleSizeChange(val) {
        this.page.pageSize = val;
        this.handleGetTableData(); //获取表数据
      },
      handleCurrentChange(val) {
        this.page.pageNum = val;
        this.handleGetTableData(); //获取表数据

      },

      //搜索
      handleQuery() {
        this.handleGetTableData(); //获取表数据
      },

      //重置
      handleReset() {
        let _this = this;
        _this.form = {
          enterpriseName: "",
          enterpriseName: "",
          enterpriseType: "",
          enterpriseType: "",
        };
      },

    }
  };
</script>
<style lang="less" scoped>
  .platform-income {
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

