<template>
  <div class="enterprise-control">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="100px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="用户名：" class="form-item">
            <el-input v-model="form.userName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业名称：" class="form-item">
            <el-input v-model="form.enterpriseName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业类型：" class="form-item">
            <el-select v-model="form.enterpriseType" placeholder="请选择">
              <el-option :label="item.label" :value="item.value" v-for="item in form.enterpriseOptions"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="企业状态：" class="form-item">
            <el-select v-model="form.enterpriseStatus" placeholder="请选择">
              <el-option :label="item.label" :value="item.value" v-for="item in form.stateOptions"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <!--<el-form-item label="地区：" class="form-item">-->
          <!--<el-select v-model="form.province" placeholder="请选择地区" @focus="handleGetWasteProvince">-->
          <!--<el-option :label="item.title" :value="item.itemCode" v-for="item in form.provinceOptions"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
        </el-col>
        <el-col :span="6">
          <el-form-item class="form-item">
            <el-button type="primary" @click="handleQuery()">搜索</el-button>
            <el-button type="info" @click="handleReset">重置</el-button>
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
        width="156"
        label="企业名称">
      </el-table-column>
      <el-table-column
        property="enterpriseType"
        label="企业类型">
      </el-table-column>
      <el-table-column
        property="status"
        label="企业状态">
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
        width="300">
        <template slot-scope="scope">          
          <el-button type="primary" size="small" @click="handleViewUserOperate(scope.row.userId)">查看用户行为</el-button>
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
               :visible.sync="firmInfoDialogFormVisible"
               :before-close="handleBeforeClose"
               center>
      <el-form :model="firmInfoForm" label-width="150px">
        <el-form-item label="企业名称：">
          <el-input v-model="firmInfoForm.enterpriseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位地址：">
          <el-input
            v-model="firmInfoForm.province+' '+firmInfoForm.city+' '+firmInfoForm.area+' '+firmInfoForm.unitAddress "
            disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="firmInfoForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="法人代表：">
          <el-input v-model="firmInfoForm.legalRepresentative" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位组织机构代码：">
          <el-input v-model="firmInfoForm.unitOrganizationCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位logo：">
          <img :src="$store.state.outputImgByIdUrl+firmInfoForm.logoAttId" alt="logo" style="width:300px;">
        </el-form-item>
        <el-form-item label="介绍图片：">
          <ul>
            <li v-for="item in firmInfoForm.displayAttIds">
              <img :src="$store.state.outputImgByIdUrl+item" :alt="item+'img'" style="width:300px;">
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="所属行业：">
          <el-input v-model="firmInfoForm.industry" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司性质：">
          <el-input v-model="firmInfoForm.companyProperties" disabled></el-input>
        </el-form-item>
        <el-form-item label="主要产品：">
          <el-input v-model="firmInfoForm.mainProducts" disabled></el-input>
        </el-form-item>
        <el-form-item label="注册时间：">
          <el-input v-model="firmInfoForm.registrationTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="注册资本：">
          <el-input v-model="firmInfoForm.registrationCapital" disabled></el-input>
        </el-form-item>
        <el-form-item label="企业证书上传：">
          <ul>
            <li v-for="item in firmInfoForm.certificateAttIds">
              <img :src="$store.state.outputImgByIdUrl+item" :alt="item+'img'"
                   style="width:160px;height:160px;float: left;">
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="公司介绍：">
          <el-input type="textarea" :rows="10" v-model="firmInfoForm.companyIntroduction" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleBeforeClose">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name: "enterpriseControl",//企业管理
    data() {
      return {
        form: {
          enterpriseType: "",//企业类型
          enterpriseOptions: [
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
            }
          ],//企业类型--数据
          enterpriseStatus: "",//企业状态
          stateOptions: [
            {
              label: '正常',
              value: "Y"
            },
            {
              label: '冻结',
              value: "N"
            },
            {
              label: '已删除',
              value: "d"
            }
          ],//企业状态--数据
        },//搜索表单
        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },
        //查看待审批用户详情
        firmInfoDialogFormVisible: false,//查看待审批用户详情-弹框
        firmInfoForm: {
          enterpriseName: "",
          province: "",
          city: "",
          area: "",
          unitAddress: "",
          phone: "",
          legalRepresentative: "",
          unitOrganizationCode: "",
          logoAttId: "",
          displayAttIds: [],
          industry: "",
          companyProperties: "",
          mainProducts: "",
          registrationTime: "",
          registrationCapital: "",
          certificateAttIds: [],
        },//查看待审批用户详情表单
      };
    },
    created() {
      this.handleGetWasteProvince(); //获取区地址信息
      this.handleGetTableData(); //获取表数据
    },
    methods: {
      handleViewUserOperate: function (userId) {
        this.$router.push({path: "/accessByUser", query: {userId: userId}});
      },
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
          url: "/user/getIsActiveUser",
          data: {
            userName: _this.form.userName,//用户名
            enterpriseName: _this.form.enterpriseName,//企业名称
            enterpriseStatus: _this.form.enterpriseStatus,//企业状态
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

      //查看用户详情
      handleLookFirmInfo(userId) {
        let _this = this;
        _this.firmInfoDialogFormVisible = true;
        _this.$axios({
          method: "post",
          url: "/user/getEnterpriseDetails",
          data: {
            userId: userId,//用户id
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              let {
                enterpriseName,
                companyIntroduction,
                province,
                city,
                area,
                unitAddress,
                phone,
                legalRepresentative,
                unitOrganizationCode,
                registrationTime,
                logoAttId,
                displayAttIds,
                industry,
                companyProperties,
                mainProducts,
                registrationCapital,
                certificateAttIds,
              } = res.data.data;
              _this.firmInfoForm.enterpriseName = enterpriseName;
              _this.firmInfoForm.companyIntroduction = companyIntroduction;
              _this.firmInfoForm.province = province;
              _this.firmInfoForm.city = city;
              _this.firmInfoForm.area = area;
              _this.firmInfoForm.unitAddress = unitAddress;
              _this.firmInfoForm.phone = phone;
              _this.firmInfoForm.legalRepresentative = legalRepresentative;
              _this.firmInfoForm.unitOrganizationCode = unitOrganizationCode;
              _this.firmInfoForm.registrationTime = registrationTime;
              _this.firmInfoForm.logoAttId = logoAttId;
              _this.firmInfoForm.displayAttIds = displayAttIds;
              _this.firmInfoForm.industry = industry;
              _this.firmInfoForm.companyProperties = companyProperties;
              _this.firmInfoForm.mainProducts = mainProducts.join();
              _this.firmInfoForm.registrationCapital = registrationCapital;
              _this.firmInfoForm.certificateAttIds = certificateAttIds;
              break;
          }
        }).catch((err) => {
          console.log(err);
        });
      },

      handleBeforeClose() {
        let _this = this;
        _this.firmInfoDialogFormVisible = false;
        _this.firmInfoForm = {
          enterpriseName: "",
          province: "",
          city: "",
          area: "",
          unitAddress: "",
          phone: "",
          legalRepresentative: "",
          unitOrganizationCode: "",
          logoAttId: "",
          displayAttIds: [],
          industry: "",
          companyProperties: "",
          mainProducts: "",
          registrationTime: "",
          registrationCapital: "",
          certificateAttIds: [],
        };
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
        _this.form.enterpriseStatus = "";
        _this.form.province = "";
      },

      //冻结
      handleFreeze(userId) {
        let _this = this;
        _this.$confirm('确认冻结该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/user/frozenEnterprise",
            data: {
              userId: userId,//用户id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '已冻结该用户!'
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
            message: '已取消删除'
          });
        });
      },

      //解冻
      handleUnfreeze(userId) {
        let _this = this;
        _this.$confirm('确认解冻该用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/user/thawEnterprise",
            data: {
              userId: userId,//用户id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '已解冻该用户!'
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
            message: '已取消删除'
          });
        });
      },

      //删除
      handleDelete(userId) {
        let _this = this;
        _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method: "post",
            url: "/user/deleteEnterprise",
            data: {
              userId: userId,//用户id
            }
          }).then((res) => {
            switch (res.data.status) {
              case 200:
                _this.$message({
                  type: 'success',
                  message: '已删除该用户!'
                });
                _this.handleGetTableData(); //获取表数据
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
    }
  };
</script>
<style lang="less" scoped>
  .enterprise-control {
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

