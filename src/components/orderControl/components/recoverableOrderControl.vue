<template>
  <div class="recoverable-order-control">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="140px">
      <el-form-item label="订单ID：" class="form-item">
        <el-input v-model="form.orderSn" placeholder="请输入产废企业名称"></el-input>
      </el-form-item>
      <el-form-item label="卖方企业：" class="form-item">
        <el-input v-model="form.sellerCompany" placeholder="请输入卖方企业名称"></el-input>
      </el-form-item>
      <el-form-item label="回收企业：" class="form-item">
        <el-input v-model="form.buyerCompany" placeholder="请输入回收企业名称"></el-input>
      </el-form-item>
      <el-form-item label="行业：" class="form-item">
        <el-select v-model="form.source"
                   placeholder="请选择危行业"
                   @focus="handleGetRoutingDictionarySourceData"
                   @change="handleChangeSource">
          <el-option :label="item.title"
                     :value="item.itemCode"
                     :key="item.itemCode"
                     v-for="item in form.sourceOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="种类：" class="form-item">
        <el-select v-model="form.category" placeholder="请选择种类"
                   @change="handleChangeCategory">
          <el-option :label="item.title"
                     :value="item.itemCode"
                     :key="item.itemCode"
                     v-for="item in form.categoryOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别：" class="form-item">
        <el-select v-model="form.subCategory" placeholder="请选择类别">
          <el-option :label="item.title" :value="item.itemCode"
                     v-for="item in form.subCategoryOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" class="form-item">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="卖方订单状态：" class="form-item">
        <el-select v-model="form.sellerOrderStatus"
                   @focus="handleGetQueryConfigWaste"
                   placeholder="请选择产废订单状态">
          <el-option :label="item.title" :value="item.itemCode"
                     :key="item.itemCode"
                     v-for="item in form.wasteOrderOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="回收企业订单状态：" class="form-item">
        <el-select v-model="form.buyerOrderStatus"
                   @focus="handleGetQueryConfigManagement"
                   placeholder="请选择处置订单状态">
          <el-option :label="item.title" :value="item.itemCode"
                     :key="item.itemCode"
                     v-for="item in form.managementOrderOptions"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button type="info" @click="handleReset">重置</el-button>
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
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        property="orderSn"
        width="160"
        label="订单ID">
      </el-table-column>
      <el-table-column
        property="title"
        width="140"
        label="标题">
      </el-table-column>
      <el-table-column
        property="subCategory"
        width="150"
        label="废品类别">
      </el-table-column>
      <el-table-column
        property="sellerCompany"
        label="卖方企业名称">
      </el-table-column>
      <el-table-column
        property="buyerCompany"
        label="回收企业名称">
      </el-table-column>
      <el-table-column
        property="sellerOrderStatus"
        width="100"
        label="卖方订单状态">
      </el-table-column>
      <el-table-column
        property="buyerOrderStatus"
        width="130"
        label="回收企业订单状态">
      </el-table-column>
      <el-table-column
        width="130"
        label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="handleShowLookOrderDialog(scope.row.id)">查看</el-button>
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

    <!-- 查看 -->
    <el-dialog
      title="查看订单详情"
      :visible.sync="lookOrderDialogVisible"
      v-if="lookOrderDialogVisible"
      width="60%">
      <!-- 物流详情 -->
      <div>
        <el-row class="top">
          <el-col :span="6" class="order-number">
            <h3>订单号：{{detail.orderSn}}</h3>
          </el-col>
          <el-col :span="18" class="step">
            <el-steps :space="200" :active="recycleActive" finish-status="success">
              <el-step :title="items" v-for="(items,indexs) in recycleSteps" :key="indexs"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </div>

      <!-- 信息列表 -->
      <div>
        <el-row class="nav">
          <el-col :span="8" class="Collectgoods">
            <h3>收货人信息：</h3>
            <p>联系人：{{consignee.contacts}}</p>
            <p>电话：{{consignee.phone}}/{{consignee.fixedLine}}</p>
            <p>邮箱：{{consignee.email}}</p>
            <p>地址：{{consignee.province+consignee.city+consignee.region+consignee.address}}</p>
          </el-col>
          <el-col :span="15" class="distribution">
            <h3>订单信息：</h3>

            <el-col :span="12">
              <el-tooltip placement="right-start" effect="light">
                <div slot="content">
                  订单名称：{{consignee.daName}}
                </div>
                <el-button class="nowrap-detail"
                           type="text">
                  订单名称：{{consignee.daName}}
                </el-button>
              </el-tooltip>
              <p>订单号：{{consignee.orderSn}}</p>
              <p>数量：{{consignee.number}}{{consignee.unit}}</p>
              <p>单价：{{!consignee.price||consignee.price=='0.00'?'面议':'￥'+consignee.price}}</p>
            </el-col>
            <el-col :span="12">
              <p>时间：{{consignee.createtime}}</p>
              <el-tooltip placement="right-start" effect="light">
                <div slot="content">
                  地址：{{consignee.provinceWaste+consignee.cityWaste+consignee.regionWaste+consignee.addressWaste}}
                </div>
                <el-button class="nowrap-detail"
                           type="text">
                  地址：{{consignee.provinceWaste+consignee.cityWaste+consignee.regionWaste+consignee.addressWaste}}
                </el-button>
              </el-tooltip>
              <el-tooltip placement="right-start" effect="light">
                <div slot="content">
                  种类：{{consignee.daCategory+'/'+consignee.daCode}}
                </div>
                <el-button class="nowrap-detail"
                           type="text">
                  种类：{{consignee.daCategory+'/'+consignee.daCode}}
                </el-button>
              </el-tooltip>
              <el-tooltip placement="right-start" effect="light">
                <div slot="content">
                  来源：{{consignee.industrySource}}{{consignee.dangerousWasteSource=='0'?'':'/'+consignee.dangerousWasteSource}}
                </div>
                <el-button class="nowrap-detail"
                           type="text">
                  来源：{{consignee.industrySource}}{{consignee.dangerousWasteSource=='0'?'':'/'+consignee.dangerousWasteSource}}
                </el-button>
              </el-tooltip>
            </el-col>
          </el-col>


        </el-row>
      </div>

      <!-- 表格-->
      <el-table class="bottom"
                :data="lookTableData"
                border
                style="width: 100%">
        <el-table-column
          label="商品"
          width="145">
          <tempalte slot-scope="scope">
            <img
              style="width:100px;height:80px;"
              :src="$store.state.outputImgUrl+scope.row.id+'&bizObjName=prod_img'"
              :alt="'img'+scope.row.id">
          </tempalte>
        </el-table-column>
        <el-table-column
          label="商品"
          width="410">
          <tempalte slot-scope="scope">
            <el-tooltip placement="right-start" effect="light">
              <div slot="content">
                {{scope.row.remark}}
              </div>
              <el-button class="nowrap-detail"
                         type="text">
                {{scope.row.remark}}
              </el-button>
            </el-tooltip>
          </tempalte>
        </el-table-column>
        <el-table-column
          prop="orderSn"
          label="商品编号">
        </el-table-column>
        <el-table-column
          prop="province"
          label="交易单价"
          width="150">
          <tempalte slot-scope="scope">
            <span>{{!scope.row.offerTotal||scope.row.offerTotal=='0.00'?'面议':'￥'+scope.row.offerTotal}}</span>
          </tempalte>
        </el-table-column>
        <el-table-column
          prop="city"
          label="数量"
          width="100">
          <tempalte slot-scope="scope">
            <span>{{scope.row.number}}{{scope.row.unit}}</span>
          </tempalte>
        </el-table-column>
      </el-table>
      <div class="price" v-for="item in lookTableData" :key="item.id">
        <h3>付款信息：</h3>
        <p>商品总价：￥<span>{{(item.number*item.offerTotal).toFixed(2)}}</span></p>
        <p>应付总额：￥<span>{{(item.number*item.offerTotal).toFixed(2)}}</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookOrderDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    name: "recoverableOrderControl",//可回收订单管理
    data() {
      return {
        form: {
          wasteOrderOptions: [],
          managementOrderOptions: [],
          source: "",
          sourceOptions: [],
          category: "",
          categoryOptions: [],
          subCategory: "",
          subCategoryOptions: [],
        },//搜索表单

        tableData: [],//表数据
        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },

        //查看
        lookOrderDialogVisible: false,
        lookId: "",
        active: '',//危废步骤
        hazardousSteps: ['提交订单', '确认订单', '签约', '付款', '运输中', '确认收货', '订单完成'],//步骤
        recycleActive: "",//回收步骤
        recycleSteps: ['待确定', '运输中', '待付款', '完成', '取消', '待买家付款'],//步骤
        detail: {},//订单编号
        consignee: {},//收货人
        lookTableData: [],//表数据
      };
    },
    created() {
      let _this = this;
      _this.handleGetTableData(); //获取表数据
    },
    methods: {

      //获取卖方订单状态
      handleGetQueryConfigWaste() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryConfig",
          data: {
            moduleCode: 'order_status_for_seller'
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.form.wasteOrderOptions = res.data.data.list;
              break;
          }
        })
      },

      //回收企业订单状态
      handleGetQueryConfigManagement() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryConfig",
          data: {
            moduleCode: 'rec_order_status_for_buyer'
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.form.managementOrderOptions = res.data.data.list;
              break;
          }
        })
      },


      //获取行业数据
      handleGetRoutingDictionarySourceData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/findDictionary",
          data: {
            moduleCode: 'hsly'
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.form.sourceOptions = res.data.data.hsly;
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

      //监听行业数据变化
      handleChangeSource(val) {
        let _this = this,
          itemId = '';
        _this.form.category = "";
        _this.form.subCategory = "";
        _this.form.sourceOptions.map(item => {
          if (item.itemCode == val) itemId = item.id
        });
        _this.$axios({
          method: "post",
          url: "/base/getListByProvinceId",
          data: {
            id: itemId
          }
        }).then((res) => {
          _this.form.categoryOptions = res.data.data;
        });
      },

      //监听种类数据变化
      handleChangeCategory(val) {
        let _this = this,
          itemId = '';
        _this.form.subCategory = "";
        _this.form.categoryOptions.map(item => {
          if (item.itemCode == val) itemId = item.id
        });
        _this.$axios({
          method: "post",
          url: "/base/getListByProvinceId",
          data: {
            id: itemId
          }
        }).then((res) => {
          _this.form.subCategoryOptions = res.data.data;
        });
      },


      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/getRecoverableOrder",
          data: {
            buyerCompany: _this.form.buyerCompany,//买方企业名称
            buyerOrderStatus: _this.form.buyerOrderStatus,//回收企业订单状态
            orderSn: _this.form.orderSn,//订单编号
            sellerCompany: _this.form.sellerCompany,//卖方企业名称
            sellerOrderStatus: _this.form.sellerOrderStatus,//卖方订单状态
            subCategory: _this.form.subCategory,//危废类别
            source: _this.form.source,//行业
            category: _this.form.category,//种类
            title: _this.form.title,//标题
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
              _this.page.total = 0;
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
        _this.form = {
          orderSn: "",
          sellerCompany: "",
          buyerCompany: "",
          source: "",
          sourceOptions: [],
          category: "",
          categoryOptions: [],
          subCategory: "",
          subCategoryOptions: [],
          title: "",
          sellerOrderStatus: "",
          wasteOrderOptions: [],
          buyerOrderStatus: "",
          managementOrderOptions: []
        };
      },

      //显示查看弹框
      handleShowLookOrderDialog(id) {
        let _this = this;
        _this.lookId = id;
        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + "/order/OrderProcess",
          data: {
            id: id,
            otherId: "2"
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.detail = res.data.data;

              if (res.data.data.orderState == 'wait_confirm') _this.recycleActive = 1;

              if (res.data.data.orderState == 'convey') _this.recycleActive = 2;

              if (res.data.data.orderState == 'wait_pay') _this.recycleActive = 3;

              if (res.data.data.orderState == 'finished') _this.recycleActive = 4;

              if (res.data.data.orderState == 'canceled') _this.recycleActive = 5;

              if (res.data.data.orderState == 'wait_buy_pay') _this.recycleActive = 6;
              break;
          }
        });  //获取物流信息数据
        _this.handleGetConsigneeInfo();   //获取收货人信息数据
        _this.handleGetConsigneeInfoTable();  //获取表数据
        _this.lookOrderDialogVisible = true;
      },

      /*查找配置项的位置*/
      findStepIndex: function (dictionary, itemCode) {
        for (var i = 0; i < dictionary.length; i++) {
          if (dictionary[i].itemCode == itemCode) {
            return i + 1;
          }
        }
        return -1;
      },

      //获取收货人信息数据
      handleGetConsigneeInfo() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + "/order/receiptOrIstribution",
          data: {
            id: _this.lookId,
            otherId: "2"
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.consignee = res.data.data;
              break;
          }
        })
      },

      //获取表数据
      handleGetConsigneeInfoTable() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: _this.$store.state.recycleAddr + "/order/productShow",
          data: {
            id: _this.lookId,
            otherId: "2"
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.lookTableData = res.data.data;
              break;
            case 300:
              _this.lookTableData = [];
              break;
            case -500:
              _this.lookTableData = [];
              break;
          }
        })
      }

    }
  };
</script>
<style lang="less" scoped>
  .recoverable-order-control {
    margin: 10px;
    .form-item {
      display: inline-block;
    }
    .pagination {
      padding-left: 33%;
      background: #fff;
      height: 50px;
      padding-top: 10px;
    }
  }
</style>

