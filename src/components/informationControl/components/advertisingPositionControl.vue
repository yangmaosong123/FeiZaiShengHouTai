<template>
  <div class="slide-show-control">

    <!-- 搜索表单 -->
    <el-button type="primary" @click="handleAddFromDialog()">新增广告</el-button>

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
        width="240"
        label="图片">
        <template slot-scope="scope">
          <img
            style="width:200px;height:120px;"
            :src="$store.state.outputImgByIdUrl+scope.row.extField2" :alt="scope.row.extField2">
        </template>
      </el-table-column>
      <el-table-column
        property="extField"
        width="200"
        label="URL">
      </el-table-column>
      <el-table-column
        property="provinceName"
        width="150"
        label="地区">
      </el-table-column>
      <el-table-column
        property="sort"
        width="80"
        label="排序">
      </el-table-column>
      <el-table-column
        label="状态"
        width="80">
        <template slot-scope="scope">
          <span>{{scope.row.status=='1'?'正常':scope.row.status=='N'?'冻结':''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="createDate"
        label="上传日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="230">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-show="scope.row.status=='N'" @click="handleStartPhone(scope.row.id)">
            启用
          </el-button>
          <el-button type="danger" size="small" v-show="scope.row.status=='1'" @click="handleStopPhone(scope.row.id)">冻结
          </el-button>
          <el-button type="success" size="small" @click="handleShowEditPhone(scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDeletePhone(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增广告-->
    <el-dialog title="新增广告" :visible.sync="addFormAboutDialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="addFormRules" label-width="130px">
        <!--<el-form-item label="标题：" prop="title">-->
        <!--<el-input v-model="addForm.title" placeholder="请输入轮播图标题"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="图片：" required>
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="addForm.unitLogo" :src="$store.state.outputImgByIdUrl+addForm.unitLogo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="URL：" prop="extField" style="margin-bottom:20px;">
          <el-input v-model="addForm.extField"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="广告投放位置：" prop="itemCode">
          <el-select v-model="addForm.itemCode" placeholder="请选择广告投放位置">
            <el-option :label="item.label" :value="item.value"
                       :key="item.value"
                       v-for="item in addForm.itemCodes"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区：" class="form-item" prop="provinceId">
          <el-select v-model="addForm.provinceId"
                     @focus="handleGetProvinceIdData"
                     placeholder="请选择地区">
            <el-option :label="item.title" :value="item.id"
                       :key="item.id"
                       v-for="item in addForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="addFormAboutDialogFormVisible = false">取消</el-button>
          <el-button @click="handleSaveAdd">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改广告-->
    <el-dialog title="查看广告" :visible.sync="editFormAboutDialogFormVisible">
      <el-form :model="editForm">
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :on-success="handleAvatarSuccess"
            :show-file-list="false">
            <img
              style="width:500px;height:400px;"
              v-if="editForm.extField2"
              :src="$store.state.outputImgByIdUrl+editForm.extField2" :alt="editForm.extField2">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="URL">
          <el-input v-model="editForm.extField"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="editForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="广告投放位置：">
          <el-select v-model="editForm.itemCode" placeholder="请选择广告投放位置">
            <el-option :label="item.label" :value="item.value"
                       :key="item.value"
                       v-for="item in editForm.itemCodes"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区：" class="form-item" prop="provinceId">
          <el-select v-model="editForm.provinceId"
                     @focus="handleGetProvinceIdData"
                     placeholder="请选择地区">
            <el-option :label="item.title" :value="item.id"
                       :key="item.id"
                       v-for="item in editForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormAboutDialogFormVisible = false">取消</el-button>
        <el-button @click="handleSaveEditPhone">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name: "slideShowControl",//轮播图管理
    data() {
      let handleURL = (rule, value, callback) => {
        let strRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?\.(?:com|cn|com.cn)/;
        if (!strRegex.test(value))
          return callback(new Error('请输入合法的url地址(如：http://www.***.com)'));
        else callback();
      };

      return {

        tableData: [],//表数据

        //新增轮播图
        addFormAboutDialogFormVisible: false,
        addForm: {
          extField2: '',//附近id
          unitLogo: "",
          itemCodes: [
            {
              label: "首页位置1",
              value: 'home1'
            },
            {
              label: "首页位置2",
              value: 'home2'
            },
            {
              label: "行情中心",
              value: 'mark1'
            }
          ],
          provinceId: "",
          provinceIds: []
        },
        addFormRules: {
          title: [
            {required: true, message: '请输入轮播图名称', trigger: 'blur'}
          ],
          extField: [
            {required: true, message: '请输入URL地址', trigger: 'blur'},
            {validator: handleURL, trigger: 'blur'}
          ],
          itemCode: [
            {required: true, message: '请选择广告位位置', trigger: 'blur'},
          ],
          provinceId: [
            {required: true, message: '请选择广告投放地区', trigger: 'blur'},
          ]
        },

        //修改轮播图
        editFormAboutDialogFormVisible: false,
        editForm: {
          id: '',
          extField2: "",
          itemCode: "",
          itemCodes: [
            {
              label: "首页位置1",
              value: 'home1'
            },
            {
              label: "首页位置2",
              value: 'home2'
            },
            {
              label: "行情中心",
              value: 'mark1'
            }
          ],
          provinceId: "",
          defaultProvinceId: "",
          provinceIds: []
        }
      };
    },
    created() {
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
              _this.addForm.provinceIds = res.data.data;
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
          url: "/base/queryAdvertismentList",
          data: {}
        }).then((res) => {
          switch (res.data.status) {
            case 200:
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
        }).catch((err) => {
          console.log(err);
        });
      },

      //显示新增轮播图
      handleAddFromDialog() {
        this.addFormAboutDialogFormVisible = true;
      },

      handleAvatarSuccess(res, file) {
        this.addForm.extField2 = res.data;
        this.addForm.unitLogo = res.data;
        this.editForm.extField2 = res.data;
        this.editForm.unitLogo = res.data;
      },

      //保存新增
      handleSaveAdd(addForm) {
        let _this = this;

        if (!_this.addForm.extField2) {
          _this.$message({
            type: 'warning',
            message: '请上广告图'
          });
        } else if (!_this.addForm.extField) {
          _this.$message({
            type: 'warning',
            message: '请填写URL地址'
          });
        } else if (!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?\.(?:com|cn|com.cn)/.test(_this.addForm.extField)) {
          _this.$message({
            type: 'warning',
            message: 'URL地址格式为：http://www.***.com，请返回修改！'
          });
        } else if (!_this.addForm.itemCode) {
          _this.$message({
            type: 'warning',
            message: '请选择广告位位置'
          });
        } else if (!_this.addForm.provinceId) {
          _this.$message({
            type: 'warning',
            message: '请选择广告投放地区'
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/base/addAdvertisment",
            data: {
              title: _this.addForm.title,
              extField2: _this.addForm.extField2,
              extField: _this.addForm.extField,
              sort: _this.addForm.sort,
              itemCode: _this.addForm.itemCode,
              provinceId: _this.addForm.provinceId
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: "success",
                  message: "图片添加成功"
                });
                _this.addFormAboutDialogFormVisible = false;
                _this.handleGetTableData(); //获取表数据
                _this.addForm = {
                  sort: "", url: "", imageUrl: "", itemCodes: [
                    {
                      label: "首页位置1",
                      value: 'home1'
                    },
                    {
                      label: "首页位置2",
                      value: 'home2'
                    },
                    {
                      label: "行情中心",
                      value: 'mark1'
                    }
                  ]
                };
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
        }
      },

      //启用图片
      handleStartPhone(id) {
        let _this = this;
        _this.$confirm('此操作将启用该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/base/unlockAdvertisment",
            data: {
              id: id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '启用成功!'
                });
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
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //冻结图片
      handleStopPhone(id) {
        let _this = this;
        _this.$confirm('此操作将冻结该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/base/lockAdvertisment",
            data: {
              id: id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '冻结成功!'
                });
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
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //删除图片
      handleDeletePhone(id) {
        let _this = this;
        _this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "delete",
            url: "/base/deleteAdvertisment",
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
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //显示修改轮播图
      handleShowEditPhone(row) {
        let _this = this,
          {id, extField2, extField, sort, itemCode, provinceId, provinceName} = row;
        _this.editForm.id = id;
        _this.editForm.extField2 = extField2;
        _this.editForm.extField = extField;
        _this.editForm.sort = sort;
        _this.editForm.itemCode = itemCode;
        _this.editForm.provinceId = provinceName;
        _this.editForm.defaultProvinceId = provinceId;
        _this.editFormAboutDialogFormVisible = true;
      },

      //保存修改
      handleSaveEditPhone() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/updateAdvertisment",
          data: {
            id: _this.editForm.id,
            sort: _this.editForm.sort,//排序
            extField2: _this.editForm.extField2,
            extField: _this.editForm.extField,//图url
            itemCode: _this.editForm.itemCode,
            provinceId: /^[\u3220-\uFA29]+$/.test(_this.editForm.provinceId) ? _this.editForm.defaultProvinceId : _this.editForm.provinceId
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.$message({
                type: "success",
                message: "图片修改成功"
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
      },

    }
  };
</script>
<style lang="less" scoped>
  .slide-show-control {
    margin: 0 10px;
    span {
      margin-left: 30px;
    }
    .pagination {
      padding-left: 75%;
      background: #fff;
      height: 50px;
      padding-top: 10px;
    }
  }
</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

