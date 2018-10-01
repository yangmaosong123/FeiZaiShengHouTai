<template>
  <div class="slide-show-control">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px" :modal="form">
      <el-form-item label="地区：" class="form-item">
        <el-select v-model="form.provinceId"
                   placeholder="请选择地区"
                   @focus="handleGetProvinceIdData">
          <el-option :label="item.title"
                     :value="item.id"
                     :key="item.id"
                     v-for="item in form.provinceIds"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" @click="handleQuery()">搜索</el-button>
        <el-button type="info" @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAddFromDialog()">新增轮播图</el-button>
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
        width="196"
        label="图片">
        <template slot-scope="scope">
          <img
            style="width:200px;height:120px;"
            :src="$store.state.outputImgByIdUrl+scope.row.extField2" :alt="scope.row.extField2">
        </template>
      </el-table-column>
      <el-table-column
        property="extField"
        width="150"
        label="URL">
      </el-table-column>
      <el-table-column
        property="provinceName"
        width="250"
        label="地区">
      </el-table-column>
      <el-table-column
        property="sort"
        label="排序">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status=='1'?'启用':scope.row.status=='N'?'冻结':''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        property="createDate"
        width="200"
        label="上传日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-show="scope.row.status=='N'" @click="handleStartPhone(scope.row.id)">启用
          </el-button>
          <el-button type="text" size="small" v-show="scope.row.status=='1'" @click="handleStopPhone(scope.row.id)">冻结
          </el-button>
          <el-button type="text" size="small" @click="handleShowEditPhone(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDeletePhone(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增轮播图-->
    <el-dialog title="新增轮播图" :visible.sync="addFormAboutDialogFormVisible">
      <el-form :model="addForm" ref="addForm" :rules="addFormRules" label-width="120px">
        <!--<el-form-item label="标题：" prop="title">-->
        <!--<el-input v-model="addForm.title" placeholder="请输入轮播图标题"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="图片：" required>
          <el-upload
            class="avatar-uploader"
            v-model="addForm.carousel"
            :action="$store.state.fileUploadUrl"
            ref="addFormUnitLogo"
            :show-file-list="false"
            :before-upload="handleBeforeAvatarUpload"
            :on-success="handleAvatarSuccess">
            <img
              v-if="addForm.unitLogo"
              :src="$store.state.outputImgByIdUrl+addForm.unitLogo"
              class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="URL：">
          <el-input v-model="addForm.extField"></el-input>
        </el-form-item>
        <el-form-item label="地区：" required>
          <el-select v-model="addForm.provinceId"
                     placeholder="请选择地区"
                     @focus="handleGetProvinceIdData">
            <el-option :label="item.title"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in addForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="addForm.sort"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addFormAboutDialogFormVisible = false">取消</el-button>
          <el-button @click="handleSaveAdd">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改轮播图-->
    <el-dialog title="查看" :visible.sync="editFormAboutDialogFormVisible">
      <el-form :model="editForm">
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            :action="$store.state.fileUploadUrl"
            :on-success="handleAvatarEditFormSuccess"
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
        <el-form-item label="地区：">
          <el-select v-model="editForm.provinceId"
                     placeholder="请选择地区"
                     @focus="handleGetProvinceIdData">
            <el-option :label="item.title"
                       :value="item.id"
                       :key="item.id"
                       v-for="item in editForm.provinceIds"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="editForm.sort"></el-input>
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

      return {
        form: {
          provinceId: '',//地区
          provinceIds: []//地区--数据
        },

        tableData: [],//表数据

        //新增轮播图
        addFormAboutDialogFormVisible: false,
        addForm: {
          extField2: '',//附件id
          unitLogo: "",//图片id
          provinceId: "",//地区
          provinceIds: [],//地区--数据
        },
        addFormRules: {
          title: [
            {required: true, message: '请输入轮播图名称', trigger: 'blur'}
          ]
        },

        //修改轮播图
        editFormAboutDialogFormVisible: false,
        editForm: {
          id: '',//当前项id
          extField2: "",//附件id
          provinceId: "",//地区
          defaultProvinceId: ""//地区--数据
        }
      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
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
          url: "/base/queryPicList",
          data: {
            provinceId: _this.form.provinceId,//地区
          }
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

      //搜索
      handleQuery() {
        let _this = this;
        _this.handleGetTableData(); //获取表数据
      },

      //重置
      handleReset() {
        let _this = this;
        _this.form.provinceId = "";//地区
      },

      //显示新增轮播图
      handleAddFromDialog() {
        let _this = this;
        _this.addFormAboutDialogFormVisible = true;
      },

      //图片上传限制
      handleBeforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/jpg',
          isLt2M = file.size / 1024 / 1024 < 2;
        let _this = this;

        if (!isJPG) {
          _this.$message.error('上传头像图片只能是 JPG,jpeg,png 格式!');
        }
        if (!isLt2M) {
          _this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

      handleAvatarSuccess(res, file) {
        let _this = this;
        _this.addForm.extField2 = res.data;
        _this.addForm.unitLogo = res.data;
      },

      handleAvatarEditFormSuccess(res) {
        let _this = this;
        _this.editForm.extField2 = res.data;
        console.log(_this.editForm.extField2);
      },

      //保存新增
      handleSaveAdd(addForm) {
        let _this = this;

        if (!_this.addForm.extField2) {
          _this.$message({
            type: 'warning',
            message: '请上传轮播图'
          });
        } else if (!_this.addForm.provinceId) {
          _this.$message({
            type: 'warning',
            message: '请选择地区'
          });
        } else {
          _this.$axios({
            method: "post",
            url: "/base/addPic",
            data: {
              title: _this.addForm.title,
              extField2: _this.addForm.extField2,
              extField: _this.addForm.extField,
              provinceId: _this.addForm.provinceId,
              sort: _this.addForm.sort,
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
                _this.addForm.unitLogo = "";
                _this.addForm.extField = "";
                _this.addForm.provinceId = "";
                _this.addForm.sort = "";
                _this.$refs.addFormUnitLogo.clearFiles();
                break;
              case 300:
                _this.$message({
                  type: "warning",
                  message: res.data.text
                });
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
            url: "/base/unlockPic",
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
            message: '已取消启用'
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
            url: "/base/lockPic",
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
            url: "/base/deletePic",
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
          {id, extField2, extField, sort, provinceId, provinceName} = row;
        _this.editForm.id = id;//id
        _this.editForm.extField2 = extField2;//附件id
        _this.editForm.provinceId = provinceName;
        _this.editForm.defaultProvinceId = provinceId;
        _this.editForm.extField = extField;//url
        _this.editForm.sort = sort;//排序
        this.editFormAboutDialogFormVisible = true;
      },

      //保存修改
      handleSaveEditPhone() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/updatePic",
          data: {
            id: _this.editForm.id,//id
            extField2: _this.editForm.extField2,//附件id
            sort: _this.editForm.sort,//排序
            provinceId: /^[\u3220-\uFA29]+$/.test(_this.editForm.provinceId) ? _this.editForm.defaultProvinceId : _this.editForm.provinceId,
            extField: _this.editForm.extField,//图url
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
    .form-item {
      display: inline-block;
    }
    margin: 10px;
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

