<template>
  <div class="announcement-control">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="发布日期：">
        <el-row>
          <el-col :span="2">
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
          <el-col :span="2">
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
          <el-col :span="4">
            <el-form-item label="标题：" class="form-item">
              <el-input class="form-item" v-model="form.title" placeholder="公告标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类型：" class="form-item">
              <el-select v-model="form.moduleCode" @focus="handleGetModuleCodeData" placeholder="请选择类型">
                <el-option :label="item.label" :value="item.value"
                           :key="item.value"
                           v-for="item in form.typeOptions"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
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
          <el-col :span="6" style="margin-left:30px;">
            <el-form-item class="form-item">
              <el-button :disabled="formDisabled" type="primary" @click="handleQuery()">搜索</el-button>
              <el-button type="info" @click="handleReset">重置</el-button>
              <el-button type="primary" @click="handleShowAnnouncementControl">发布公告</el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
        label="公告标题">
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
          <span>{{scope.row.moduleCode=='info'?'资讯':scope.row.moduleCode=='notice'?'公告':''}}</span>
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
        property="provinceName"
        label="地区">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleLookRowAnnouncement(scope.row.id)">查看</el-button>
          <el-button type="warning" size="small" @click="handleEditAnnouncementControl(scope.row)">修改</el-button>
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

    <!-- 发布公告 -->
    <el-dialog title="发布公告" :visible.sync="issueFormAnnouncementDialogFormVisible">
      <el-form :model="issueForm" ref="issueForm" label-width="120px">
        <el-form-item label="公告标题：" required>
          <el-input v-model="issueForm.title" maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="公告类型：" required>
          <el-select v-model="issueForm.moduleCode" placeholder="请选择公告类型">
            <el-option :label="item.label" :value="item.value"
                       :key="item.value"
                       v-for="item in issueForm.enterpriseOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区：" required>
          <el-select v-model="issueForm.provinceId" placeholder="请选择地区" @focus="handleGetProvinceIdData">
            <el-option :label="item.title"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in issueForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容：" required>
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
    <el-dialog title="查看公告" :visible.sync="lookFormAnnouncementDialogFormVisible">
      <div>
        <h3>{{lookForm.provinceId}}</h3>
        <h3>{{lookForm.title}}</h3>
        <h4>{{lookForm.createDate}}</h4>
        <div class="" v-html="lookForm.content"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookFormAnnouncementDialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑公告 -->
    <el-dialog title="编辑公告" :visible.sync="editFormAnnouncementDialogFormVisible">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="公告标题：" required>
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="公告类型：">
          <el-select v-model="editForm.moduleCode"
                     placeholder="请选择公告类型">
            <el-option :label="item.label"
                       :value="item.value"
                       v-for="item in editForm.editOptions">

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区：" required>
          <el-select v-model="editForm.provinceId"
                     placeholder="请选择地区"
                     @focus="handleGetProvinceIdData">
            <el-option :label="item.title"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in editForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容：" required>
          <quill-editor ref="myTextEditor"
                        v-model="editForm.content">
          </quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormAnnouncementDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditAnnouncement">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  export default {
    name: "announcementControl",//公告管理
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
          moduleCode: "",//类型
          typeOptions: [
            {
              value: 'all',
              label: '全部'
            },
            {
              value: 'notice',
              label: '公告'
            },
            {
              value: 'info',
              label: '资讯'
            }
          ],//类型--数据
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
          moduleCode: "",//公告类型
          enterpriseOptions: [
            {
              label: '公告',
              value: "notice"
            },
            {
              label: '资讯',
              value: "info"
            }],//公告类型--数据
          provinceId: "",//地区
          provinceIds: []//地区--数据
        },//发布公告

        //查看公告
        lookFormAnnouncementDialogFormVisible: false,
        lookForm: {provinceId: ""},

        //修改公告
        editFormAnnouncementDialogFormVisible: false,
        editForm: {
          id: "",//当前编辑的id
          moduleCode: "",//公告类型
          editOptions: [
            {
              value: 'notice',
              label: '公告'
            },
            {
              value: 'info',
              label: '资讯'
            }
          ],//公告类型--数据
          defaultModuleCode: "",
          provinceId: "",//地区
          defaultProvinceId: "",//地区--后端返回的默认数据
          provinceIds: [],//地区--数据
        }

      };
    },
    created() {

      let _this = this;
      _this.handleGetTableData(); //获取表数据

    },
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

      //获取类型数据
      handleGetModuleCodeData() {
        let _this = this;
        _this.form.typeOptions = [
          {
            value: 'all',
            label: '全部'
          },
          {
            value: 'notice',
            label: '公告'
          },
          {
            value: 'info',
            label: '资讯'
          }
        ];
      },

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

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryNoticeList",
          data: {
            title: _this.form.title,//标题
            moduleCode: _this.form.moduleCode,//类型
            provinceId: _this.form.provinceId,//地区
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
        this.handleGetTableData(); //获取表数据
      },

      //重置
      handleReset() {
        let _this = this;
        _this.form.startTime = "";
        _this.form.endTime = "";
        _this.form.title = "";
        _this.form.moduleCode = "";
        _this.form.provinceId = "";
      },

      //显示发布公告弹框
      handleShowAnnouncementControl() {
        let _this = this;
        _this.issueFormAnnouncementDialogFormVisible = true;
        _this.handleGetProvinceIdData();
      },


      //发布公告
      handleIssueAnnouncement(issueForm) {
        let _this = this;
        if (!_this.issueForm.title) _this.$message({
          type: 'warning',
          message: '公告标题必填'
        });
        else if (!_this.issueForm.moduleCode) _this.$message({
          type: 'warning',
          message: '公告类型必填'
        });
        else if (!_this.issueForm.provinceId) _this.$message({
          type: 'warning',
          message: '地区必选'
        });
        else if (!_this.issueForm.content) _this.$message({
          type: 'warning',
          message: '公告内容必填'
        });
        else
          _this.$axios({
            method: "post",
            url: "/base/pubNotice",
            data: {
              title: _this.issueForm.title,
              moduleCode: _this.issueForm.moduleCode,
              provinceId: _this.issueForm.provinceId,
              content: _this.issueForm.content
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '公告发布成功!'
                });
                _this.issueFormAnnouncementDialogFormVisible = false;
                _this.handleGetTableData(); //获取表数据
                _this.issueForm.title = "";
                _this.issueForm.moduleCode = "";
                _this.issueForm.provinceId = "";
                _this.issueForm.content = "";
                break;
              case 300:
                _this.$message({
                  type: "warning",
                  message: res.data.text
                });
                _this.tableData = [];
                break;
            }
          });
      },

      //查看公告
      handleLookRowAnnouncement(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryById",
          data: {
            id: id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              let {provinceId, title, createDate, content} = res.data.data;
              _this.lookForm.title = title;
              _this.lookForm.createDate = createDate;
              _this.lookForm.content = content;
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
                    res.data.data.map(item => {
                      if (item.id == provinceId)
                        _this.lookForm.provinceId = item.title;
                    });
                    break;
                }
              });
              _this.lookFormAnnouncementDialogFormVisible = true;
              break;
            case 300:
              _this.$message({
                type: "warning",
                message: res.data.text + '请联系后端处理!'
              });
              break;
          }
        })
      },

      //删除公告
      handleDeleteRowAnnouncement(id) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "delete",
            url: "/base/deleteNotice",
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

      //显示编辑公告弹框
      handleEditAnnouncementControl(row) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryById",
          data: {
            id: row.id,//当前编辑公告的id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.editFormAnnouncementDialogFormVisible = true;
              let {id, title, moduleCode, provinceId, content} = res.data.data;
              _this.editForm.id = id;
              _this.editForm.title = title;

              _this.editForm.defaultModuleCode = moduleCode;
              _this.editForm.editOptions.map(item => {
                if (item.value == moduleCode)
                  _this.editForm.moduleCode = item.label;
              });
              _this.editForm.defaultProvinceId = provinceId;
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
                    res.data.data.map(item => {
                      if (item.id == provinceId) _this.editForm.provinceId = item.title;
                    });
                    break;
                }
              });
              _this.editForm.content = content;
              break;
          }
        });
      },

      //保存编辑公告
      handleEditAnnouncement() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/updateNotice",
          data: {
            id: _this.editForm.id,//当前编辑公告的id
            title: _this.editForm.title,//标题
            moduleCode: /^[\u3220-\uFA29]+$/.test(_this.editForm.moduleCode) ? _this.editForm.defaultModuleCode : _this.editForm.moduleCode,
            provinceId: /^[\u3220-\uFA29]+$/.test(_this.editForm.provinceId) ? _this.editForm.defaultProvinceId : _this.editForm.provinceId,
            content: _this.editForm.content,//开始时间
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
            case 300:
              _this.$message({
                type: "warning",
                message: res.data.text + '请联系后端处理！'
              });
              break;
          }
        })
      },

    }
  };
</script>
<style lang="less" scoped>
  .announcement-control {
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

