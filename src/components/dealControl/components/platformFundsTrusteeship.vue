<template>
  <div class="platformFunds-trusteeship">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="企业名称：" class="form-item">
        <el-input v-model="form.enterpriseName" placeholder="请输入收款企业"></el-input>
      </el-form-item>
      <el-form-item label="银行账户：" class="form-item">
        <el-input v-model="form.enterpriseName" placeholder="请输入交易流水号"></el-input>
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
        label="企业名称">
      </el-table-column>
      <el-table-column
        property="enterpriseName"
        width="156"
        label="银行账户">
      </el-table-column>
      <el-table-column
        property="enterpriseTypeName "
        label="余额">
      </el-table-column>
      <el-table-column
        property="phone"
        label="危废类别">
      </el-table-column>
      <el-table-column
        property="phone"
        label="产废企业名称">
      </el-table-column>
      <el-table-column
        property="phone"
        label="处置企业名称">
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
    name: "platformFundsTrusteeship",//平台资金托管
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

    }
  };
</script>
<style lang="less" scoped>
  .platformFunds-trusteeship {
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

