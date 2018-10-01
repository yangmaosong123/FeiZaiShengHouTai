<template>
  <div class="config">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="发布日期：" required>
            <el-row>
              <el-col :span="10">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="开始日期"
                                v-model="form.startTime"
                                style="width: 100%;">

                </el-date-picker>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="10">
                <el-date-picker type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="结束日期"
                                v-model="form.endTime"
                                style="width: 100%;">
                </el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>

        </el-col>
        <el-col :span="4">
          <el-form-item label="标题：" class="form-item">
            <el-input class="form-item" v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="模块编码：" class="form-item">
            <el-input class="form-item" v-model="form.moduleCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item class="form-item">
            <el-button type="primary" @click="handleQuery()">搜索</el-button>
            <el-button type="info" @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleShowAddFormDialog">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%">
      <el-table-column
        property="id"
        label="id"
        width="100">
      </el-table-column>
      <el-table-column
        property="parentId"
        label="父级ID">
      </el-table-column>
      <el-table-column
        property="parentName"
        width="156"
        label="父级名称">
      </el-table-column>
      <el-table-column
        property="moduleCode"
        label="模块编码">
      </el-table-column>
      <el-table-column
        property="itemCode"
        label="字段编码">
      </el-table-column>
      <el-table-column
        property="title"
        label="标题">
      </el-table-column>
      <el-table-column
        property="createDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleShowEditFormDialog(scope.row)">修改</el-button>
          <el-button type="danger" @click="handleDeleteRowData(scope.row.id)">删除</el-button>
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

    <!-- 新增config -->
    <el-dialog title="新增" :visible.sync="addFormDialogFormVisible">
      <el-form ref="addForm" :model="addForm" label-width="120px" :rules="addFormRules">
        <el-form-item label="标题：" class="form-item" prop="title">
          <el-input v-model="addForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="模块编码：" class="form-item" prop="moduleCode">
          <el-input v-model="addForm.moduleCode" placeholder="请输入模块编码"></el-input>
        </el-form-item>
        <el-form-item label="产品编码：" class="form-item" prop="itemCode">
          <el-input v-model="addForm.itemCode" placeholder="请输入产品编码"></el-input>
        </el-form-item>
        <el-form-item label="父级id：" class="form-item" prop="parentId">
          <el-input v-model="addForm.parentId" placeholder="请输入父级id"></el-input>
        </el-form-item>
        <el-form-item label="备注：" class="form-item" prop="remark">
          <el-input type="textarea" v-model="addForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="addFormDialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="handleQueryAddForm('addForm')" :disabled="addFormDisabled">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑config -->
    <el-dialog title="编辑" :visible.sync="editFormDialogFormVisible">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-form-item label="标题：" class="form-item" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="模块编码：" class="form-item" prop="moduleCode">
          <el-input v-model="editForm.moduleCode" placeholder="请输入模块编码"></el-input>
        </el-form-item>
        <el-form-item label="产品编码：" class="form-item" prop="itemCode">
          <el-input v-model="editForm.itemCode" placeholder="请输入产品编码"></el-input>
        </el-form-item>
        <el-form-item label="父级id：" class="form-item" prop="parentId">
          <el-input v-model="editForm.parentId" placeholder="请输入父级id"></el-input>
        </el-form-item>
        <el-form-item label="备注：" class="form-item" prop="remark">
          <el-input type="textarea" v-model="editForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="editFormDialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click="handleQueryEditForm('editForm')" :disabled="editFormDisabled">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>
<script>
  export default {
    name: "config",//系统配置
    data() {
      let handleVerificationParentId = (rule, value, callback) => {
        if (!value) callback(new Error("请输入父级id"));
        else if (isNaN(value)) callback(new Error("父级id必须为数字"));
        else callback();
      };

      return {
        form: {},//搜索表单

        //新增
        addFormDisabled: false,
        addFormDialogFormVisible: false,
        addForm: {},
        addFormRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ],
          moduleCode: [
            {required: true, message: '请输入模块编码', trigger: 'blur'},
          ],
          parentId: [
            {validator: handleVerificationParentId, trigger: 'blur'}
          ],
        },

        //编辑
        editFormDisabled: false,
        editFormDialogFormVisible: false,
        editForm: {},
        editFormRules: {
          id: "",
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
          ]
        },

        //表数据
        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },
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
          url: "/base/queryConfig",
          data: {
            startTime: _this.form.startTime,
            endTime: _this.form.endTime,
            title: _this.form.title,
            moduleCodeLike: _this.form.moduleCode,
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
        }).catch((err) => {
          console.log(err);
        });
      },

      //分页事件
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetTableData(); //获取表数据
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.pageNum = val;
        this.handleGetTableData(); //获取表数据

      },
      handleQuery() {
        this.handleGetTableData(); //获取表数据
      },

      //重置
      handleReset() {
        let _this = this;
        _this.form = {
          startTime: "",
          endTime: "",
          title: "",
          moduleCode: ""
        };
      },

      //删除
      handleDeleteRowData(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "delete",
            url: "/base/deleteConfig",
            data: {
              id: id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                _this.handleGetTableData(); //获取表数据
                break;
            }
          })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //显示新增系统配置
      handleShowAddFormDialog() {
        let _this = this;
        _this.addFormDialogFormVisible = true;
      },

      //保存新增系统配置
      handleQueryAddForm(addForm) {
        let _this = this;
        _this.$refs[addForm].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              _this.addFormDisabled = true;
              _this.$axios({
                method: "post",
                url: "/base/addConfig",
                data: {
                  itemCode: _this.addForm.itemCode,//产品编码
                  moduleCode: _this.addForm.moduleCode,//模块编码
                  parentId: _this.addForm.parentId,//父ID
                  remark: _this.addForm.remark,//备注
                  title: _this.addForm.title//标题
                }
              }).then((res) => {
                switch (res.data.status) {
                  case 200:
                    _this.$message({
                      type: 'success',
                      message: "新增成功！"
                    });
                    _this.addFormDialogFormVisible = false;
                    _this.addFormDisabled = false;
                    _this.handleGetTableData(); //获取表数据
                    _this.addForm = {
                      title: "",
                      moduleCode: "",
                      itemCode: "",
                      parentId: "",
                      remark: "",
                    };
                    break;
                  case -500:
                    _this.$message({
                      type: 'warning',
                      message: res.data.text
                    });
                    _this.addFormDialogFormVisible = true;
                    _this.addFormDisabled = false;
                    break;
                }
              })
            }, 500);
          } else {
            _this.addFormDisabled = false;
            return false;
          }
        });
      },

      //显示编辑系统配置
      handleShowEditFormDialog(row) {
        let _this = this;
        let {id, title, moduleCode, itemCode, parentId, remark} = row;
        _this.editForm.id = id;
        _this.editForm.title = title;
        _this.editForm.moduleCode = moduleCode;
        _this.editForm.itemCode = itemCode;
        _this.editForm.parentId = parentId;
        _this.editForm.remark = remark;
        _this.editFormDialogFormVisible = true;
      },

      //保存编辑系统配置
      handleQueryEditForm(editForm) {
        let _this = this;
        _this.$refs[editForm].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              _this.editFormDisabled = true;
              _this.$axios({
                method: "post",
                url: "/base/updateConfig",
                data: {
                  id: _this.editForm.id,
                  itemCode: _this.editForm.itemCode,//产品编码
                  moduleCode: _this.editForm.moduleCode,//模块编码
                  parentId: _this.editForm.parentId,//父ID
                  remark: _this.editForm.remark,//备注
                  title: _this.editForm.title //标题
                }
              }).then((res) => {
                switch (res.data.status) {
                  case 200:
                    _this.$message({
                      type: 'success',
                      message: "编辑成功"
                    });
                    _this.editFormDialogFormVisible = false;
                    _this.editFormDisabled = false;
                    _this.handleGetTableData(); //获取表数据
                    break;
                  case -500:
                    _this.$message({
                      type: 'warning',
                      message: res.data.text
                    });
                    _this.editFormDialogFormVisible = true;
                    _this.editFormDisabled = false;
                    break;
                }
              })
            }, 500);
          } else {
            _this.editFormDisabled = false;
            return false;
          }
        });
      },
    }
  };
</script>
<style lang="less" scoped>
  .config {
    margin: 10px;
    .pagination {
      padding-left: 33%;
      background: #fff;
      height: 50px;
      padding-top: 10px;
    }
    .line {
      text-align: center;
    }
  }
</style>

