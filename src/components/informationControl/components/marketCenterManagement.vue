<template>
  <div class="market-center-management">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="发布日期：">
        <el-row>
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

          <el-col :span="5">
            <el-form-item label="回收来源：" prop="extField">
              <el-select v-model="form.extField"
                         placeholder="请选择回收来源"
                         @focus="handleGetMarketTableData"
                         @change="handleChangeItemCode">
                <el-option :label="item.title" :value="item.itemCode"
                           :key="item.itemCode"
                           v-for="item in form.enterpriseOptions"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="4">
          <el-form-item label="回收类别：" prop="itemCode">
            <el-select v-model="form.itemCode"
                       placeholder="请选择回收类别">
              <el-option :label="item.title" :value="item.itemCode"
                         :key="item.itemCode"
                         v-for="item in form.itemCodes"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="标题：" class="form-item">
            <el-input class="form-item" v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
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
        <el-col :span="8">
          <el-form-item class="form-item">
            <el-button :disabled="formDisabled" type="primary" @click="handleQuery()">搜索</el-button>
            <el-button type="info" @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleShowAnnouncementControl">发布行情</el-button>
          </el-form-item>
        </el-col>
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
        width="200"
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
        label="回收来源">
        <template slot-scope="scope">
          <span>
             {{findConfigItem(scope.row.extField,$store.state.dictionary.hsly).title}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="回收种类">
        <template slot-scope="scope">
          <span>
             {{findConfigItem(scope.row.itemCode,$store.state.dictionary.hszl).title}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        property="createName"
        width="100"
        label="发布人">
      </el-table-column>
      <el-table-column
        property="createDate"
        label="发布时间">
      </el-table-column>
      <el-table-column
        property="provinceName"
        width="120"
        label="地区">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="250">
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

    <!-- 发布行情 -->
    <el-dialog title="发布行情"
               :visible.sync="issueFormAnnouncementDialogFormVisible">
      <el-form :model="issueForm"
               ref="issueForm"
               :rules="issueFormRules"
               label-width="120px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="issueForm.title" placeholder="请输入行情名称"></el-input>
        </el-form-item>
        <el-form-item label="回收来源："
                      prop="extField"
                      style="margin-top:20px;">
          <el-select v-model="issueForm.extField"
                     placeholder="请选择回收来源"
                     @change="handleChangeItemCode"
                     @focus="handleGetMarketTableData">
            <el-option :label="item.title" :value="item.itemCode"
                       :key="item.itemCode"
                       v-for="item in issueForm.enterpriseOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回收种类：" prop="itemCode"
                      style="margin-top:20px;">
          <el-select v-model="issueForm.itemCode"
                     placeholder="请选择回收种类">
            <el-option :label="item.title" :value="item.itemCode"
                       :key="item.itemCode"
                       v-for="item in issueForm.itemCodes"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区：" prop="provinceId"
                      style="margin-top:20px;">
          <el-select v-model="issueForm.provinceId"
                     placeholder="请选择地区"
                     @focus="handleGetProvinceIdData">
            <el-option :label="item.title"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in issueForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" required
                      style="margin-top:20px;">
          <el-col :span="24">
            <el-form-item prop="content">
              <quill-editor ref="myTextEditor"
                            v-model="issueForm.content">
              </quill-editor>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="issueFormAnnouncementDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleIssueAnnouncement('issueForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看行情 -->
    <el-dialog title="查看行情" :visible.sync="lookFormAnnouncementDialogFormVisible">
      <div>
        <h3>{{lookForm.title}}</h3>
        <div v-html="lookForm.content"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookFormAnnouncementDialogFormVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑行情 -->
    <el-dialog title="编辑行情"
               :before-close="handleEditFormClose"
               :visible.sync="editFormAnnouncementDialogFormVisible">
      <el-form :model="editForm"
               ref="editForm"
               label-width="100px"
               :rules="editFormRules">
        <el-form-item label="标题：" prop="title" class="item-edit">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="回收来源：" prop="extField" class="item-edit">
          <el-select v-model="editForm.extField"
                     placeholder="请选择回收来源"
                     @change="handleChangeItemCode"
                     @focus="handleGetMarketTableData">
            <el-option :label="item.title" :value="item.itemCode"
                       :key="item.itemCode"
                       v-for="item in editForm.enterpriseOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回收类别：" prop="itemCode" class="item-edit">
          <el-select v-model="editForm.itemCode"
                     :disabled="editFormDisabled"
                     placeholder="请选择回收类别">
            <el-option :label="item.title" :value="item.itemCode"
                       :key="item.itemCode"
                       v-for="item in editForm.itemCodes"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区：" required class="item-edit">
          <el-select v-model="editForm.provinceId"
                     placeholder="请选择地区"
                     @focus="handleGetProvinceIdData">
            <el-option :label="item.title"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in editForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容：" required class="item-edit">
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
        <el-button @click="handleEditFormClose">取 消</el-button>
        <el-button type="primary" @click="handleEditAnnouncement('editForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  export default {
    name: "marketCenterManagement",//行情中心
    data() {
      return {

        form: {
          provinceId: "",//地区
          provinceIds: [],//地区--数据
          startTime: "",//开始时间
          endTime: "",//结束时期
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 8.64e6
            }
          },//时间选择限制
          title: "",//标题
          extField: "",//回收来源
          enterpriseOptions: [],//回收来源--数据
          itemCode: "",//回收类别
          itemCodes: []//回收类别--数据
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
          title: "",
          extField: "",
          provinceId: "",
          enterpriseOptions: [],//行情中心--数据
          itemCode: "",//行情中心--值
          itemCodes: []
        },//发布公告
        issueFormRules: {
          title: [{required: true, message: '请输入行情名称', trigger: 'blur'}],
          extField: [{required: true, message: '请选择回收来源', trigger: 'blur'}],
          provinceId: [{required: true, message: '请选择地区', trigger: 'blur'}],
          itemCode: [{required: true, message: '请选择回收种类', trigger: 'blur'}],
          content: [{required: true, message: '请输入行情内容', trigger: 'blur'}],
        },

        //查看公告
        lookFormAnnouncementDialogFormVisible: false,
        lookForm: {},

        //修改公告
        editFormAnnouncementDialogFormVisible: false,
        editForm: {
          extField: "",
          defaultExtField: "",
          provinceId: "",
          defaultProvinceId: "",
          itemCode: '',
          defaultItemCode: "",
          id: "",//当前编辑的id
          enterpriseOptions: [],
        },
        editFormDisabled: false,
        editFormRules: {
          title: [{required: true, message: '请输入行情名称', trigger: 'blur'}],
          extField: [{required: true, message: '请选择回收来源', trigger: 'blur'}],
          itemCode: [{required: true, message: '请选择回收种类', trigger: 'blur'}],
          content: [{required: true, message: '请输入行情内容', trigger: 'blur'}],
        },
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

      //获取行情数据
      handleGetMarketTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: "hsly"
          }
        }).then((res) => {
          _this.form.enterpriseOptions = res.data.data.hsly;
          _this.issueForm.enterpriseOptions = res.data.data.hsly;
          _this.editForm.enterpriseOptions = res.data.data.hsly;
          console.log(_this.issueForm.enterpriseOptions);
        });
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
          url: "/base/queryMarketList",
          data: {
            title: _this.form.title,//标题
            startTime: _this.form.startTime,//开始时间
            endTime: _this.form.endTime,//开始时间
            extField: _this.form.extField,
            itemCode: _this.form.itemCode,
            provinceId: _this.form.provinceId,
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
          startTime: "",
          endTime: "",
          title: "",
          extField: "",
          itemCode: "",
          provinceId: '',
          provinceIds: [],
          enterpriseOptions: [],
          itemCodes: [],
        };
      },

      //显示发布行情弹框
      handleShowAnnouncementControl() {
        let _this = this;
        _this.issueFormAnnouncementDialogFormVisible = true;
      },


      //发布行情
      handleIssueAnnouncement(issueForm) {
        let _this = this;
        _this.$refs[issueForm].validate((valid) => {
          if (valid) {
            _this.$axios({
              method: "post",
              url: "/base/pubMarket",
              data: _this.issueForm
            }).then((res) => {
              switch (res.data.status) {
                case 200:
                  _this.$message({
                    type: 'success',
                    message: '行情发布成功!'
                  });
                  _this.issueFormAnnouncementDialogFormVisible = false;
                  _this.handleGetTableData(); //获取表数据
                  _this.issueForm.title = "";
                  _this.issueForm.extField = "";
                  _this.issueForm.itemCode = "";
                  _this.issueForm.provinceId = "";
                  _this.issueForm.content = "";
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

      //查看行情
      handleLookRowAnnouncement(id) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryMarketById",
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

      //删除行情
      handleDeleteRowAnnouncement(id) {
        let _this = this;
        _this.$confirm('是否删除该文件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "delete",
            url: "/base/deleteMarket",
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

      //显示编辑行情弹框
      handleEditAnnouncementControl(row) {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryMarketById",
          data: {
            id: row.id,//当前编辑公告的id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              let {id, title, extField, itemCode, provinceId, content} = res.data.data;
              _this.editForm.id = id;
              _this.editForm.title = title;
              _this.editForm.defaultExtField = extField;
              _this.$axios({
                method: "post",
                url: "/base/findDictionary",
                data: {
                  moduleCode: "hsly"
                }
              }).then((res) => {
                res.data.data.hsly.map(item => {
                  if (item.itemCode == extField) {
                    _this.editForm.extField = item.title;
                    _this.$axios({
                      method: "post",
                      url: "/base/getListByProvinceId",
                      data: {
                        id: item.id
                      }
                    }).then((res) => {
                      res.data.data.map(item1 => {
                        if (item1.itemCode == itemCode) {
                          _this.editForm.itemCode = item1.title;
                          _this.editForm.defaultItemCode = item1.itemCode;
                          console.log(_this.editForm.defaultItemCode);
                        }
                      });
                    });
                  }
                });
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
              _this.editFormDisabled = true;
              _this.editFormAnnouncementDialogFormVisible = true;
              break;
          }
        });
      },

      handleEditFormClose() {
        let _this = this;
        _this.editFormAnnouncementDialogFormVisible = false;
        _this.editFormDisabled = false;
        _this.editForm = {
          id: "",
          defaultExtField: "",
          title: "",
          extField: "",
          enterpriseOptions: [],
          itemCode: "",
          itemCodes: [],
          provinceId: "",
          provinceIds: [],
          content: ""
        };
      },

      handleChangeItemCode(val) {
        let _this = this, itemId = '';
        _this.form.itemCode = "";
        _this.issueForm.itemCode = "";
        _this.editForm.itemCode = "";
        _this.form.enterpriseOptions.map(item => {
          if (item.itemCode == val) itemId = item.id
        });
        _this.issueForm.enterpriseOptions.map(item => {
          if (item.itemCode == val) itemId = item.id
        });
        _this.editFormDisabled = false;
        _this.editForm.enterpriseOptions.map(item => {
          if (item.itemCode == val) itemId = item.id
        });
        _this.$axios({
          method: "post",
          url: "/base/getListByProvinceId",
          data: {
            id: itemId
          }
        }).then((res) => {
          _this.form.itemCodes = res.data.data;
          _this.issueForm.itemCodes = res.data.data;
          _this.editForm.itemCodes = res.data.data;
        });
      },

      //保存编辑行情
      handleEditAnnouncement(editForm) {
        let _this = this;
        _this.$refs[editForm].validate((valid) => {
          if (valid) {
            _this.$axios({
              method: "post",
              url: "/base/updateMarket",
              data: {
                id: _this.editForm.id,
                title: _this.editForm.title,
                extField: /^[\u3220-\uFA29]+$/.test(_this.editForm.extField) ? _this.editForm.defaultExtField : _this.editForm.extField,
                itemCode: /[\u4e00-\u9fa5]+$/g.test(_this.editForm.itemCode) ? _this.editForm.defaultItemCode : _this.editForm.itemCode,
                provinceId: /^[\u3220-\uFA29]+$/.test(_this.editForm.provinceId) ? _this.editForm.defaultProvinceId : _this.editForm.provinceId,
                content: _this.editForm.content
              }
            }).then((res) => {
              switch (res.data.status) {
                case 200:
                  _this.$message({
                    type: 'success',
                    message: '行情编辑成功!'
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
          } else {
            _this.$message({
              type: 'warning',
              message: '带红星的选项为必填/必选项，请返回修改！'
            });
            return false;
          }
        });
      },

    }
  };
</script>
<style lang="less" scoped>
  .market-center-management {
    margin: 10px;
    img{
      width: 400px;
    }
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
    .item-edit {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>

