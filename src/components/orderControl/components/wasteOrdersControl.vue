<template>
  <div class="waste-orders-control">

    <!-- 搜索表单 -->
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="订单ID：" class="form-item">
        <el-input v-model="form.orderSn" placeholder="请输入产废企业名称"></el-input>
      </el-form-item>
      <el-form-item label="产废企业：" class="form-item">
        <el-input v-model="form.wasteEnterprise" placeholder="请输入产废企业名称"></el-input>
      </el-form-item>
      <el-form-item label="处置企业：" class="form-item">
        <el-input v-model="form.managementEnterprise" placeholder="请输入处置企业名称"></el-input>
      </el-form-item>
      <el-form-item label="危废类别：" class="form-item">
        <el-select v-model="form.daCategory"
                   placeholder="请选择危废类别"
                   @focus="handleGetRoutingDictionaryData">
          <el-option :label="item.title"
                     :value="item.itemCode"
                     v-for="item in form.daCategoryOptions"
                     :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="危废类型：" class="form-item">
        <el-select v-model="form.daType" placeholder="请选择危废类型">
          <el-option :label="item.label" :value="item.value"
                     v-for="item in form.daTypeOptions"
                     :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题：" class="form-item">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="产废订单状态：" class="form-item">
        <el-select v-model="form.wasteOrderStatus"
                   @focus="handleGetQueryConfig"
                   placeholder="请选择产废订单状态">
          <el-option :label="item.title"
                     :value="item.itemCode"
                     v-for="item in form.wasteOrderOptions"
                     :key="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处置订单状态：" class="form-item">
        <el-select v-model="form.managementOrderStatus"
                   placeholder="请选择处置订单状态">
          <el-option :label="item.label" :value="item.value"
                     v-for="item in form.managementOrderOptions"
                     :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button type="primary" @click="handleQuery()">搜索</el-button>
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
        label="序号">
      </el-table-column>
      <el-table-column
        property="orderSn"
        label="订单ID">
      </el-table-column>
      <el-table-column
        property="title"
        label="标题">
      </el-table-column>
      <el-table-column
        property="daType"
        label="危废类型">
      </el-table-column>
      <el-table-column
        property="daCategory"
        label="危废类别">
      </el-table-column>
      <el-table-column
        property="wasteEnterprise"
        label="产废企业名称">
      </el-table-column>
      <el-table-column
        property="managementEnterprise"
        label="处置企业名称">
      </el-table-column>
      <el-table-column
        property="wasteOrderStatus"
        label="产废订单状态">
      </el-table-column>
      <el-table-column
        property="managementOrderStatus"
        label="处置订单状态">
      </el-table-column>
      <el-table-column
        fixed="right"
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
            <el-steps :space="200" :active="active" finish-status="success">
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
                           type="text"
                           @click="handleGoToLogisticsDetail(props.row)">
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
    name: "wasteOrdersControl",//危废订单管理
    data() {
      return {
        form: {
          daTypeOptions: [
            {
              value: "2",
              label: '可回收'
            },
            {
              value: "1",
              label: '不可回收'
            }
          ],
          wasteOrderStatus: "",//产废订单状态
          wasteOrderOptions: [],//产废订单状态--数据
          managementOrderOptions: [
            {
              value: '2',
              label: ' 待签约'
            },
            {
              value: '3',
              label: ' 待产废签约'
            },
            {
              value: '4',
              label: ' 待产废付款'
            },
            {
              value: '5',
              label: ' 待产废上传备案'
            },
            {
              value: '6',
              label: ' 待付款'
            },
            {
              value: '7',
              label: ' 资金冻结'
            },
            {
              value: '8',
              label: ' 解冻放款'
            },
            {
              value: '9',
              label: ' 待收货'
            },
            {
              value: '10',
              label: ' 待收款'
            },
            {
              value: '11',
              label: ' 上传处置结果'
            },
            {
              value: '12',
              label: ' 已完成'
            }]
        },//搜索表单

        tableData: [],//表数据

        page: {
          total: 0,//总条数
          pageNum: 1,//页码
          pageSize: 10,//页条数
        },

        //查看待审批用户详情
        firmInfoDialogFormVisible: false,//查看待审批用户详情-弹框
        userInfoForm: {},//查看待审批用户详情表单

        //查看
        lookOrderDialogVisible: false,
        lookId: "",
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
      // _this.handleGetQueryConfig(); //获取订单状态
      _this.handleGetRoutingDictionaryData(); //获取路由词典数据
      _this.handleGetTableData(); //获取表数据
    },
    methods: {

      //获取订单状态
      handleGetQueryConfig() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/base/queryConfig",
          data: {
            moduleCode: 'ORDER_STATUS'
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.form.wasteOrderOptions = res.data.data.list;
              console.log("_this.form.wasteOrderOptions", _this.form.wasteOrderOptions);
              break;
          }
        })
      },

      //获取路由词典数据
      handleGetRoutingDictionaryData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/getWasteType",
          data: {
            moduleCode: 'wflb'
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.form.daCategoryOptions = res.data.data;
              break;
          }
        })
      },


      //获取表数据
      handleGetTableData() {
        let _this = this;
        _this.$axios({
          method: "post",
          url: "/order/getHazardousWasteOrder",
          data: {
            orderSn: _this.form.orderSn,//订单Id
            daCategory: _this.form.daCategory,//危废类别
            daType: _this.form.daType,//危废类型
            managementEnterprise: _this.form.managementEnterprise,//处置企业
            wasteOrderStatus: _this.form.wasteOrderStatus,//产废订单状态
            managementOrderStatus: _this.form.managementOrderStatus,//处置订单状态
            title: _this.form.title,//标题
            wasteEnterprise: _this.form.wasteEnterprise,//产废企业
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
        _this.form.orderSn = "";
        _this.form.wasteEnterprise = "";
        _this.form.managementEnterprise = "";
        _this.form.daCategory = "";
        _this.form.title = "";
        _this.form.daType = "";
        _this.form.wasteOrderStatus = "";
        _this.form.managementOrderStatus = "";
        _this.form.wasteOrderOptions = [
          {
            value: '0',
            label: ' 待处置签约'
          },
          {
            value: '1',
            label: ' 已发布'
          },
          {
            value: '2',
            label: ' 待签约'
          },
          {
            value: '3',
            label: ' 已签约'
          },
          {
            value: '4',
            label: ' 待上传备案'
          },
          {
            value: '5',
            label: ' 待付款'
          },
          {
            value: '6',
            label: ' 待处置付款'
          },
          {
            value: '7',
            label: ' 已付款'
          },
          {
            value: '8',
            label: ' 资金冻结'
          },
          {
            value: '9',
            label: ' 已运出'
          },
          {
            value: '10',
            label: ' 派单中'
          },
          {
            value: '11',
            label: ' 待交货'
          },
          {
            value: '12',
            label: ' 待收款'
          },
          {
            value: '13',
            label: ' 解冻放款'
          },
          {
            value: '14',
            label: ' 已完成'
          }

        ];
        _this.form.managementOrderOptions = [
          {
            value: '2',
            label: ' 待签约'
          },
          {
            value: '3',
            label: ' 待产废签约'
          },
          {
            value: '4',
            label: ' 待产废付款'
          },
          {
            value: '5',
            label: ' 待产废上传备案'
          },
          {
            value: '6',
            label: ' 待付款'
          },
          {
            value: '7',
            label: ' 资金冻结'
          },
          {
            value: '8',
            label: ' 解冻放款'
          },
          {
            value: '9',
            label: ' 待收货'
          },
          {
            value: '10',
            label: ' 待收款'
          },
          {
            value: '11',
            label: ' 上传处置结果'
          },
          {
            value: '12',
            label: ' 已完成'
          }];
        _this.form.daTypeOptions = [
          {
            value: "2",
            label: '可回收'
          },
          {
            value: "1",
            label: '不可回收'
          }]
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
            otherId: "1"
          }
        }).then((res) => {
          switch (res.data.status) {
            case 200:
              _this.detail = res.data.data;

              if (res.data.data.selected == 'N') _this.active = 1;

              if (res.data.data.selected == 'Y') _this.active = 2;

              if ((res.data.data.orderState = '4' && res.data.data.disposalOrderState == '5') ||
                (res.data.data.orderState = '6' && res.data.data.disposalOrderState == '6')) _this.active = 3;

              if ((res.data.data.orderState = '8' && res.data.data.disposalOrderState == '9') ||
                (res.data.data.orderState = '11' && res.data.data.disposalOrderState == '7')) _this.active = 4;

              if (res.data.data.orderState > '8' && res.data.data.orderState < '11') _this.active = 5;

              if ((res.data.data.orderState = '13' && res.data.data.disposalOrderState == '10') ||
                (res.data.data.orderState = '12' && res.data.data.disposalOrderState == '8')) _this.active = 6;

              if (res.data.data.orderState = '4' && res.data.data.disposalOrderState == '12') _this.active = 7;
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
            otherId: "1"
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
            otherId: "1"
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
  .waste-orders-control {
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

