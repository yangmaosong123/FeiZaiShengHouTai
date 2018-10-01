<template>
  <div class="home-information-management">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">

      <el-form-item label="发布日期：">
        <el-col :span="3">
          <el-date-picker type="date"
                          placeholder="开始日期"
                          :clearable="false"
                          v-model="form.startTime"
                          :picker-options="form.pickerOptions"
                          @blur="handleCompareTheSize"
                          value-format="yyyy-MM-dd"
                          style="width: 100%;">
          </el-date-picker>
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="3">
          <el-date-picker type="date"
                          placeholder="结束日期"
                          :clearable="false"
                          v-model="form.endTime"
                          value-format="yyyy-MM-dd"
                          @blur="handleCompareTheSize"
                          :picker-options="form.pickerOptions"
                          style="width: 100%;">
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <el-form-item label="公告标题：" class="form-item">
            <el-input class="form-item" v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="form-item">
            <el-button :disabled="formDisabled" type="primary" @click="handleQuery()">搜索</el-button>
            <el-button type="info" @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleShowAnnouncementControl">发布信息</el-button>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width:100%">
      <el-table-column
        label="序号"
        width="50"
        type="index">
      </el-table-column>
      <el-table-column
        label="标题">
        <template slot-scope="scope">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">{{scope.row.title}}</div>
            <el-button class="nowrap" type="text">
              {{scope.row.title}}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.itemCode=='serviceProcess'?'服务流程':
            ( scope.row.itemCode=='wasteProcess'?'危废处理':
            (scope.row.itemCode=='chargeStandard'?'收费标准':
            (scope.row.itemCode=='serviceProduct'?'服务产品':(scope.row.itemCode=='recycleProcess'?'回收流程':''))))}}
          </span>
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
        width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleLookRowAnnouncement(scope.row.id)">查看</el-button>
          <el-button type="success" size="small" @click="handleEditAnnouncementControl(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDeleteRowAnnouncement(scope.row.id)">删除</el-button>
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

    <!-- 发布信息 -->
    <el-dialog title="发布信息" :visible.sync="issueFormAnnouncementDialogFormVisible">
      <el-form :model="issueForm" ref="issueForm" :rules="issueFormRules" label-width="120px">
        <el-form-item label="标题：" required>
          <el-input v-model="issueForm.title"></el-input>
        </el-form-item>
        <el-form-item label="类型：" required>
          <el-select v-model="issueForm.itemCode" placeholder="请选择类型">
            <el-option :label="item.label" :value="item.value"
                       :key="item.value"
                       v-for="item in issueForm.enterpriseOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" required>
          <quill-editor ref="myTextEditor"
                        v-model="issueForm.content">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="issueFormAnnouncementDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleIssueAnnouncement('issueForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看信息 -->
    <el-dialog title="查看信息" :visible.sync="lookFormAnnouncementDialogFormVisible">
      <div>
        <h3>{{lookForm.title}}</h3>
        <div v-html="lookForm.content" id="details"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookFormAnnouncementDialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑信息 -->
    <el-dialog title="编辑信息" :visible.sync="editFormAnnouncementDialogFormVisible">
      <el-form :model="editForm" :rules="editFormRules" label-width="100px" ref="editForm">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="itemCode">
          <el-select v-model="editForm.itemCode" placeholder="请选择类型" @change="handleChange">
            <el-option :label="item.label" :value="item.value"
                       :key="item.value"
                       v-for="item in editForm.enterpriseOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" required>
          <el-col :span="24">
            <el-form-item prop="content">
              <quill-editor ref="myTextEditor"
                            v-model="editForm.content">
              </quill-editor>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormAnnouncementDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditAnnouncement('editForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  export default {
    name: "homeInformationManagement",//首页信息管理
    data() {
      return {

        form: {
          startTime: "",//开始时间
          endTime: "",//结束时期
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 8.64e6
            }
          },//时间选择限制
          title: "",//标题
        },//搜索表单
        formDisabled: false,//控制搜索

        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },

        //公告弹框
        issueFormAnnouncementDialogFormVisible: false,//
        issueForm: {
          enterpriseOptions: [
            {
              label: '服务流程',
              value: 'serviceProcess'
            },
            {
              label: '危废处理',
              value: 'wasteProcess'
            },
            {
              label: '服务产品',
              value: 'serviceProduct'
            },
            {
              label: '收费标准',
              value: 'chargeStandard'
            },
            {
              label: '回收流程',
              value: 'recycleProcess'
            }

          ],
        },//发布公告
        issueFormRules: {
          title: [{required: true, message: '请输入公告名称', trigger: 'blur'}],
          itemCode: [{required: true, message: '请选择公告类型', trigger: 'blur'}],
        },

        //查看公告
        lookFormAnnouncementDialogFormVisible: false,
        lookForm: {},


        //修改公告
        editFormAnnouncementDialogFormVisible: false,
        editForm: {
          itemCode: '',
          id: "",//当前编辑的id
          enterpriseOptions: [
            {
              label: '服务流程',
              value: 'serviceProcess'
            },
            {
              label: '危废处理',
              value: 'wasteProcess'
            },
            {
              label: '服务产品',
              value: 'serviceProduct'
            },
            {
              label: '收费标准',
              value: 'chargeStandard'
            },
            {
              label: '回收流程',
              value: 'recycleProcess'
            }
          ],
        },
        editFormRules: {
          title: [{required: true, message: '请输入公告名称', trigger: 'blur'}],
          itemCode: [{required: true, message: '请选择公告类型', trigger: 'blur'}],
          content: [{required: true, message: '请填空信息内容', trigger: 'blur'}],
        },
      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
    },
    components: {},
    methods: {

      //时间控制
      handleCompareTheSize() {
        let _this = this;
        if (_this.form.startTime && _this.form.endTime)
          if (_this.form.startTime > _this.form.endTime) {
            _this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间，请返回修改！'
            });
            _this.formDisabled = true;
          } else _this.formDisabled = false;
        else _this.formDisabled = false;
      },

      //监听数据变化
      handleChange(value) {
        let _this = this;
        _this.editForm.enterpriseOptions.map(item => {
          console.log(item);
          if (value === item.value)
            _this.editForm.itemCode = item.value;
        });
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryHomeInfoList",
          data: {
            title: _this.form.title,//标题
            startTime: _this.form.startTime,//开始时间
            endTime: _this.form.endTime,//开始时间
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
            case -500:
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
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.handleGetTableData(); //获取表数据
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
          title: "",
          startTime: "",
          endTime: "",
        };
      },

      //显示发布公告弹框
      handleShowAnnouncementControl() {
        this.issueFormAnnouncementDialogFormVisible = true;
      },


      //发布信息
      handleIssueAnnouncement(issueForm) {
        let _this = this;
        if (!_this.issueForm.title) _this.$message({
          type: 'warning',
          message: '信息标题必填'
        });
        else if (!_this.issueForm.itemCode) _this.$message({
          type: 'warning',
          message: '信息类型必填'
        });
        else if (!_this.issueForm.content) _this.$message({
          type: 'warning',
          message: '信息内容必填'
        });
        else
          _this.$axios({
            method: "post",
            url: "/base/pubHomeInfo",
            data: _this.issueForm
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '信息发布成功!'
                });
                _this.issueFormAnnouncementDialogFormVisible = false;
                _this.handleGetTableData(); //获取表数据
                _this.issueForm = {
                  title: "",//信息标题
                  content: "",//信息内容
                  itemCode: '',//信息类型
                  enterpriseOptions: [
                    {
                      label: '服务流程',
                      value: 'serviceProcess'
                    },
                    {
                      label: '危废处理',
                      value: 'wasteProcess'
                    },
                    {
                      label: '服务产品',
                      value: 'serviceProduct'
                    },
                    {
                      label: '收费标准',
                      value: 'chargeStandard'
                    },
                    {
                      label: '回收流程',
                      value: 'recycleProcess'
                    }
                  ],
                };
                break;
              case 1000:
                _this.$message({
                  type: "warning",
                  message: res.data.text
                });
                _this.handleGetTableData(); //获取表数据
                break;
            }
          });
      },

      //查看信息
      handleLookRowAnnouncement(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryHomeInfoById",
          data: {
            id: id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.lookForm = res.data.data;
              _this.lookFormAnnouncementDialogFormVisible = true;
              break;
            case 300:
              _this.$message({
                type: "warning",
                message: res.data.text
              });
              break;
          }
        })
      },

      //删除信息
      handleDeleteRowAnnouncement(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "delete",
            url: "/base/deleteHomeInfo",
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
              case 405:
                _this.$message({
                  type: "warning",
                  message: res.data.error
                });
                _this.tableData = [];
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

      //显示编辑信息弹框
      handleEditAnnouncementControl(row) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryHomeInfoById",
          data: {
            id: row.id,//当前编辑公告的id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              let {id, title, itemCode, content} = res.data.data;
              _this.editForm.id = id;
              _this.editForm.title = title;
              _this.editForm.itemCode = itemCode;
              _this.editForm.DefaultItemCode = itemCode;
              _this.editForm.enterpriseOptions = [
                {
                  label: '服务流程',
                  value: 'serviceProcess'
                },
                {
                  label: '危废处理',
                  value: 'wasteProcess'
                },
                {
                  label: '服务产品',
                  value: 'serviceProduct'
                },
                {
                  label: '收费标准',
                  value: 'chargeStandard'
                },
                {
                  label: '回收流程',
                  value: 'recycleProcess'
                }
              ];
              _this.editForm.content = content;
              _this.editFormAnnouncementDialogFormVisible = true;
              break;
          }
        });
      },

      //保存编辑信息
      handleEditAnnouncement(editForm) {
        let _this = this;
        _this.$refs[editForm].validate((valid) => {
          if (valid) {
            _this.$axios({
              method: "post",
              url: "/base/updateHomeInfo",
              data: {
                id: _this.editForm.id,
                title: _this.editForm.title,
                content: _this.editForm.content,
                itemCode: /^[\u3220-\uFA29]+$/.test(_this.editForm.itemCode) ? _this.editForm.DefaultItemCode : _this.editForm.itemCode
              }
            }).then((res) => {
              switch (res.data.status) {
                case 200:
                  _this.$message({
                    type: 'success',
                    message: '公告编辑成功!'
                  });
                  _this.editFormAnnouncementDialogFormVisible = false;
                  _this.handleGetTableData(); //获取表数据
                  break;
                case 1000:
                  _this.$message({
                    type: "warning",
                    message: res.data.text
                  });
                  _this.handleGetTableData(); //获取表数据
                  break;
              }
            });
          } else {
            _this.$message({
              type: "warning",
              message: "带红星的选项为必填/必选项，请返回修改！"
            });
            return false;
          }
        });
      },

    }
  };
</script>
<style lang="less" scoped>
  .home-information-management {
    margin: 10px;

    .form-item {
      display: inline-block;
    }
    .line {
      text-align: center;
    }
    .pagination {
      padding-left: 33%;
      background: #fff;
      height: 50px;
      padding-top: 10px;
    }
  }

</style>
<style lang="less">
  #details {
    p {
      img {
        width: 100% !important;
      }
    }
  }
</style>

