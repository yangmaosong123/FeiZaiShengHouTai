<template>
  <div class="about-us">
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
        label="标题">
        <template slot-scope="scope">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">{{scope.row.title}}</div>
            <el-button class="nowrap-system" type="text">
              {{scope.row.title}}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        property="createName"
        label="发布人">
      </el-table-column>
      <el-table-column
        property="createDate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleLook(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="handleShowEditForm(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看 -->
    <el-dialog title="查看" :visible.sync="lookFormAboutDialogFormVisible">
      <el-form :model="lookForm">
        <el-form-item>
          <h3>{{lookForm.title}}</h3>
          <div v-html="lookForm.content"></div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="editFormAboutDialogFormVisible">
      <el-form :model="editForm">
        <el-form-item label="公告标题">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
          <quill-editor ref="myTextEditor"
                        v-model="editForm.content">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormAboutDialogFormVisible = false">取消</el-button>
        <el-button @click="handleSaveEdit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name: "aboutUs",//关于我们
    data() {
      return {

        tableData: [],//表数据

        //查看
        lookFormAboutDialogFormVisible: false,//
        lookForm: {},

        //修改
        editFormAboutDialogFormVisible: false,//
        editForm: {},
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
          url: "/base/queryAbout"
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.tableData = res.data.data;
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

      //查看
      handleLook(row) {
        let _this = this;
        _this.lookForm = row;
        _this.lookFormAboutDialogFormVisible = true;
      },

      //显示修改弹框
      handleShowEditForm(row) {
        let _this = this;
        _this.editForm = row;
        _this.editFormAboutDialogFormVisible = true;
      },

      //保存修改
      handleSaveEdit() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/updateAbout",
          data: {
            content: _this.editForm.content,
            title: _this.editForm.title
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.$message({
                type: "success",
                message: "保存成功"
              });
              _this.editFormAboutDialogFormVisible = false;
              _this.handleGetTableData(); //获取表数据
              break;
            case 300:
              _this.$message({
                type: "warning",
                message: res.data.text
              });
              break;
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .about-us {
    margin: 10px;
    .form-item {
      display: inline-block;
      padding-top: 10px;
    }
    .pagination {
      padding-left: 75%;
      background: #fff;
      height: 50px;
      padding-top: 10px;
    }
  }
</style>

