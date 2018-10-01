<template>
  <div class="examine-control">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="用户名：" class="form-item">
            <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="企业名称：" class="form-item">
            <el-input v-model="form.enterpriseName" placeholder="请输入企业名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="企业类型：" class="form-item">
            <el-select v-model="form.enterpriseType" placeholder="请选择企业类型">
              <el-option :label="item.label" :value="item.value" v-for="item in form.enterpriseOptions"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-form-item label="地区：" class="form-item">-->
        <!--<el-select v-model="form.province" placeholder="请选择地区" @focus="handleGetWasteProvince">-->
        <!--<el-option :label="item.title" :value="item.itemCode" v-for="item in form.provinceOptions"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-col :span="6">
          <el-form-item class="form-item" style="margin-left:30px">
            <el-button type="primary" @click="handleQuery()">搜索</el-button>
            <el-button type="info" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        property="account"
        label="用户名">
      </el-table-column>
      <el-table-column
        property="enterpriseName"
        label="企业名称">
      </el-table-column>
      <el-table-column
        property="enterpriseType"
        width="110"
        label="企业类型">
      </el-table-column>
      <el-table-column
        property="status"
        width="80"
        label="状态">
      </el-table-column>
      <el-table-column
        property="phone"
        label="联系电话">
      </el-table-column>
      <el-table-column
        property="email"
        width="180"
        label="联系邮箱">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleLookUserInfo(scope.row.userId)">查看</el-button>
          <el-button type="success" size="small" @click="handlePass(scope.row.userId)">通过</el-button>
          <el-button type="info" size="small" @click="handleShowReject(scope.row.userId)">拒绝</el-button>
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

    <!-- 查看待审批用户详情 -->
    <el-dialog title="企业详情"
               :visible.sync="userInfoDialogFormVisible"
               center>
      <el-form :model="userInfoForm" label-width="150px">
        <el-form-item label="企业名称：">
          <el-input v-model="userInfoForm.enterpriseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位地址：" v-show="userInfoForm.province">
          <el-input
            v-model="userInfoForm.province+' '+userInfoForm.city+' '+userInfoForm.area+' '+userInfoForm.unitAddress "
            disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="userInfoForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="法人代表：">
          <el-input v-model="userInfoForm.legalRepresentative" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位组织机构代码：">
          <el-input v-model="userInfoForm.unitOrganizationCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位logo：" v-show="userInfoForm.logoAttId">
          <img :src="$store.state.outputImgByIdUrl+userInfoForm.logoAttId" alt="logo" style="width:300px;">
        </el-form-item>
        <el-form-item label="介绍图片：">
          <ul>
            <li v-for="item in userInfoForm.displayAttIds">
              <img :src="$store.state.outputImgByIdUrl+item" :alt="item+'img'" style="width:300px;;">
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="所属行业：">
          <el-input v-model="userInfoForm.industry" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司性质：">
          <el-input v-model="userInfoForm.companyProperties" disabled></el-input>
        </el-form-item>
        <el-form-item label="主要产品：">
          <el-input v-model="userInfoForm.mainProducts" disabled></el-input>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-input v-model="userInfoForm.registrationTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="注册资本：">
          <el-input v-model="userInfoForm.registrationCapital" disabled></el-input>
        </el-form-item>
        <el-form-item label="企业证书上传：">
          <ul>
            <li v-for="item in userInfoForm.certificateAttIds">
              <img :src="$store.state.outputImgByIdUrl+item" :alt="item+'img'"
                   style="width:160px;height:160px;float: left;">
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="公司介绍：">
          <el-input type="textarea" v-model="userInfoForm.companyIntroduction" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userInfoDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="拒绝通过审批"
               :visible.sync="refuseDialogFormVisible"
               :before-close="handleBeforeClose"
               center>
      <el-form :model="refuseForm" ref="refuseForm" :rules="refuseFormRules" label-width="140px">
        <el-form-item prop="remark" label="拒绝通过理由：">
          <el-input type="textarea" v-model="refuseForm.remark" placeholder="请输入拒绝通过理由"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="handleBeforeClose">取 消</el-button>
        <el-button type="primary" @click="handleReject('refuseForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name: "examineControl",//审批管理
    data() {
      return {
        form: {
          enterpriseName: "",//企业名称
          enterpriseType: "",//企业类型
          enterpriseOptions: [
            {
              label: '全部',
              value: "all"
            },
            {
              label: '产废企业',
              value: "cf"
            },
            {
              label: '处置企业',
              value: "cz"
            },
            {
              label: '回收企业',
              value: "hs"
            },
          ]
        },//搜索表单
        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },
        //查看待审批用户详情
        userInfoDialogFormVisible: false,//查看待审批用户详情-弹框
        userInfoForm: {},//查看待审批用户详情表单
        refuseForm: {userId: ""},//拒绝通过审批
        refuseDialogFormVisible: false,
        refuseFormRules: {
          remark: [{required: true, message: '请输入拒绝通过理由', trigger: 'blur'}]
        },//拒绝通过审批--验证规则
      };
    },
    created() {
      this.handleGetWasteProvince(); //获取区地址信息
      this.handleGetTableData(); //获取表数据
    },
    methods: {

      //获取区地址信息
      handleGetWasteProvince() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/getProvinceList",
          data: {
            moduleCode: "qy",
            parentId: 0
          }
        }).then((res) => {
          if (res.data.status === 200) {
            _this.form.provinceOptions = res.data.data;
          }
        })

      },

      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/user/getApprovalPendingUser",
          data: {
            userName: _this.form.userName,//用户名
            enterpriseName: _this.form.enterpriseName,//企业名称
            enterpriseType: _this.form.enterpriseType,//企业类型
            pageNum: _this.page.pageNum,//页码
            pageSize: _this.page.pageSize,//页条数
            province: _this.form.province,//省
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

      //搜索
      handleQuery() {
        this.handleGetTableData(); //获取表数据
      },

      //重置
      handleReset() {
        let _this = this;
        _this.form.userName = "";
        _this.form.enterpriseName = "";
        _this.form.enterpriseType = "";
        _this.form.province = "";
      },

      //查看用户详情
      handleLookUserInfo(userId) {
        let _this = this;
        _this.userInfoDialogFormVisible = true;
        _this.$axios({
          method: "post",
          url: "/user/getEnterpriseDetails",
          data: {
            userId: userId,//用户id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.userInfoForm = res.data.data;
              break;
          }
        }).catch((err) => {
          console.log(err);
        });
      },


      //通过
      handlePass(userId) {
        let _this = this;
        _this.$confirm('确认通过该用户审核吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/user/throughAudit",
            data: {
              userId: userId,//用户id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '已通过!'
                });
                _this.handleGetTableData(); //获取表数据
                break;
              case 400:
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
            message: '已取消通过'
          });
        });
      },

      //显示拒绝弹框
      handleShowReject(userId) {
        let _this = this;
        _this.refuseForm.userId = userId;
        _this.refuseDialogFormVisible = true;
      },

      //拒绝
      handleReject(refuseForm) {
        let _this = this;
        _this.$refs[refuseForm].validate((valid) => {
          if (valid) {
            _this.$axios({
              method: "post",
              url: "/user/refuseAudit",
              data: {
                userId: _this.refuseForm.userId,//用户id
                remark: _this.refuseForm.remark//拒绝理由
              }
            }).then((res) => {
              switch (res.data.status) {
                case 200:
                  _this.$message({
                    type: 'success',
                    message: '已拒绝通过审核!'
                  });
                  _this.refuseDialogFormVisible = false;
                  _this.handleGetTableData(); //获取表数据
                  break;
                case 400:
                  _this.$message({
                    type: "warning",
                    message: res.data.text
                  });
                  break;
              }
            }).catch((err) => {
              console.log(err);
            });
          } else {
            return false;
          }
        });
      },
      handleBeforeClose() {
        let _this = this;
        _this.refuseDialogFormVisible = false;
        _this.refuseForm.remark = "";
      }
    }
  };
</script>


<style lang="less" scoped>
  .el-form-item__content {
    margin-left: 30px;
  }

  .examine-control {
    position: relative;
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

