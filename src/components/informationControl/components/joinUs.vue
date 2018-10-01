<template>
  <div class="join-us">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="120px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="职位">
            <el-input v-model="form.postName" placeholder="请输入职位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="部门">
            <el-input v-model="form.departmentName" placeholder="请输入部门"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="工作地点">
            <el-input v-model="form.workingPlace" placeholder="请输入工作地点"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="地区：" class="form-item">
            <el-select v-model="form.provinceId"
                       @focus="handleGetProvinceIdData"
                       placeholder="请选择地区">
              <el-option :label="item.title" :value="item.id"
                         :key="item.id"
                         v-for="item in form.provinceIds"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item label="发布日期：" required>
          <el-col :span="3">
            <el-date-picker type="date"
                            placeholder="选择开始日期"
                            v-model="form.startTime"
                            style="width: 100%;">

            </el-date-picker>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="3">
            <el-date-picker type="date"
                            placeholder="选择结束日期"
                            v-model="form.endTime"
                            style="width: 100%;">

            </el-date-picker>
          </el-col>
          <el-col :span="8" style="margin-left:20px;">
            <el-form-item class="form-item">
              <el-button type="primary" @click="handleQuery()">搜索</el-button>
              <el-button type="info" @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleShowAnnouncementControl">发布招聘</el-button>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-row>
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
        label="招聘职位">
        <template slot-scope="scope">
          <el-tooltip placement="right-start" effect="light">
            <div slot="content">{{scope.row.postName}}</div>
            <el-button class="nowrap" type="text">
              {{scope.row.postName}}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="departmentName"
        label="部门名称">
      </el-table-column>
      <el-table-column
        property="workingPlace"
        label="工作地点">
      </el-table-column>
      <el-table-column
        property="recruitsNum"
        label="招聘人数">
      </el-table-column>
      <el-table-column
        property="userName"
        label="发布人">
      </el-table-column>
      <el-table-column
        property="createTime"
        width="168"
        label="发布时间">
      </el-table-column>
      <el-table-column
        property="provinceName"
        label="地区">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleLookRowAnnouncement(scope.row.id)">查看</el-button>
          <el-button type="text" size="small" @click="handleEditAnnouncementControl(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDeleteRowAnnouncement(scope.row.id)">删除</el-button>
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

    <!-- 发布招聘 -->
    <el-dialog title="发布招聘"
               :visible.sync="issueFormAnnouncementDialogFormVisible">
      <el-form :model="issueForm"
               ref="issueForm"
               :rules="issueFormRules"
               label-width="120px">
        <el-form-item label="招聘职位：" prop="postName">
          <el-input v-model="issueForm.postName"></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="departmentName">
          <el-input v-model="issueForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="工作地点：" prop="workingPlace">
          <el-input v-model="issueForm.workingPlace"></el-input>
        </el-form-item>
        <el-form-item label="地区：" class="form-item">
          <el-select v-model="issueForm.provinceId"
                     @focus="handleGetProvinceIdData"
                     placeholder="请选择地区">
            <el-option :label="item.title" :value="item.id"
                       :key="item.id"
                       v-for="item in issueForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘人数：" prop="recruitsNum">
          <el-input v-model="issueForm.recruitsNum"></el-input>
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

    <!-- 查看公告 -->
    <el-dialog title="查看招聘"
               :visible.sync="lookFormAnnouncementDialogFormVisible">
      <div>
        <h3>招聘职位：{{lookForm.postName}}</h3>
        <h3>部门名称：{{lookForm.departmentName}}</h3>
        <h3>工作地点：{{lookForm.province}}</h3>
        <h3>招聘人数：{{lookForm.recruitsNum}}</h3>
        <h3>发布时间：{{lookForm.createTime}}</h3>
        <h3>岗位职责：{{lookForm.title}}</h3>
        <div>任职要求：{{lookForm.content}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookFormAnnouncementDialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑招聘 -->
    <el-dialog title="编辑招聘"
               :visible.sync="editFormAnnouncementDialogFormVisible">
      <el-form :model="editForm"
               ref="editForm"
               :rules="issueFormRules"
               label-width="120px">
        <el-form-item label="招聘职位：" prop="postName">
          <el-input v-model="editForm.postName"></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="departmentName">
          <el-input v-model="editForm.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="工作地点：" prop="workingPlace">
          <el-input v-model="editForm.workingPlace"></el-input>
        </el-form-item>
        <el-form-item label="地区：" class="form-item">
          <el-select v-model="editForm.provinceId"
                     @focus="handleGetProvinceIdData"
                     placeholder="请选择地区">
            <el-option :label="item.title" :value="item.id"
                       :key="item.id"
                       v-for="item in editForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="招聘人数：" prop="recruitsNum">
          <el-input v-model="editForm.recruitsNum"></el-input>
        </el-form-item>
        <el-form-item label="内容：" required>
          <quill-editor ref="myTextEditor"
                        v-model="editForm.content">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormAnnouncementDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditAnnouncement()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  export default {
    name: "joinUs",//加入我们
    data() {
      return {

        form: {
          provinceId: "",
          provinceIds: []
        },//搜索表单

        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },

        //公告弹框
        issueFormAnnouncementDialogFormVisible: false,//
        issueForm: {
          provinceId: "",
          provinceIds: []
        },//发布公告
        issueFormRules: {
          postName: [{required: true, message: '请输入招聘职位', trigger: 'blur'}],
          departmentName: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
          workingPlace: [{required: true, message: '请输入工作地点', trigger: 'blur'}],
          recruitsNum: [{required: true, message: '请输入招聘人数', trigger: 'blur'}],
          content: [{required: true, message: '请输入内容', trigger: 'blur'}],
        },

        //查看公告
        lookFormAnnouncementDialogFormVisible: false,
        lookForm: {},

        //修改公告
        editFormAnnouncementDialogFormVisible: false,
        editForm: {
          itemCode: '',
          id: "",//当前编辑的id
          provinceId: "",
          provinceIds: []
        },
        editFormRules: {
          postName: [{required: true, message: '请输入招聘职位', trigger: 'blur'}],
          departmentName: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
          workingPlace: [{required: true, message: '请输入工作地点', trigger: 'blur'}],
          recruitsNum: [{required: true, message: '请输入招聘人数', trigger: 'blur'}],
          content: [{required: true, message: '请输入内容', trigger: 'blur'}],
        },
      };
    },
    created() {
      this.handleGetProvinceData(); //获取省数据
      this.handleGetTableData(); //获取表数据
    },
    methods: {

      //获取地区数据
      handleGetProvinceIdData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/getProvinceList",
          data: {
            moduleCode: 'qy',
            parentId: 0
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.form.provinceIds = res.data.data;
              _this.issueForm.provinceIds = res.data.data;
              _this.editForm.provinceIds = res.data.data;
              break;
          }
        })
      },

      //获取省数据
      handleGetProvinceData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/getProvinceList",
          data: {
            moduleCode: "qy",
            parentId: '0'
          }
        }).then((res) => {
          _this.form.formOptions = res.data.data;
        });
      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/enterprise/findList",
          data: {
            postName: _this.form.postName,//职位
            startTime: _this.form.startTime,//开始时间
            endTime: _this.form.endTime,//开始时间
            departmentName: _this.form.departmentName,//部门
            workingPlace: _this.form.workingPlace,//工作地点
            provinceId: _this.form.provinceId,//地区
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
          postName: "",
          departmentName: "",
          workingPlace: "",
          province: "",
          startTime: "",
          endTime: "",
        };
      },

      //显示发布公告弹框
      handleShowAnnouncementControl() {
        this.issueFormAnnouncementDialogFormVisible = true;
      },


      //发布招聘
      handleIssueAnnouncement(issueForm) {
        let _this = this;
        if (!_this.issueForm.postName) _this.$message({
          type: 'warning',
          message: '招聘职位必填'
        });
        else if (!_this.issueForm.departmentName) _this.$message({
          type: 'warning',
          message: '部门名称必填'
        });
        else if (!_this.issueForm.workingPlace) _this.$message({
          type: 'warning',
          message: '工作地点必填'
        });
        else if (isNaN(_this.issueForm.recruitsNum)) _this.$message({
          type: 'warning',
          message: '招聘人数必须为数字'
        });
        else if (_this.issueForm.recruitsNum < 1) _this.$message({
          type: 'warning',
          message: '招聘人数必须>=1'
        });
        else if (!_this.issueForm.recruitsNum) _this.$message({
          type: 'warning',
          message: '招聘人数必填且'
        });
        else if (!_this.issueForm.content) _this.$message({
          type: 'warning',
          message: '内容必填'
        });
        else
          _this.$axios({
            method: "post",
            url: "/enterprise/add",
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
                  postName: "",//招聘职位
                  departmentName: "",//部门名称
                  workingPlace: '',//工作地点
                  recruitsNum: '',//招聘人数
                  content: '',//内容
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
          url: "/enterprise/findOne",
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
            method: "post",
            url: "/enterprise/delete",
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
          url: "/enterprise/findOne",
          data: {
            id: row.id,//当前编辑公告的id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              let {id, postName, departmentName, workingPlace, recruitsNum, content} = res.data.data;
              _this.editForm.id = id;
              _this.editForm.postName = postName;
              _this.editForm.departmentName = departmentName;
              _this.editForm.workingPlace = workingPlace;
              _this.editForm.recruitsNum = recruitsNum;
              _this.editForm.content = content;
              _this.editFormAnnouncementDialogFormVisible = true;
              break;
          }
        });
      },

      //保存编辑信息
      handleEditAnnouncement() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/enterprise/update",
          data: {
            uid: _this.editForm.id,
            postName: _this.editForm.postName,
            departmentName: _this.editForm.departmentName,
            workingPlace: _this.editForm.workingPlace,
            recruitsNum: _this.editForm.recruitsNum,
            content: _this.editForm.content,
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.$message({
                type: 'success',
                message: '编辑成功!'
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
        })
      },

    }
  };
</script>


<style lang="less" scoped>
  .join-us {
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

