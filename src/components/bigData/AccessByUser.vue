<!--
    2017.2.11
    by vanishment
    *************
    echarts小组件
-->
<style scoped>
.content {
    /*自行添加样式即可*/
}

#main {
    /*需要制定具体高度，以px为单位*/
    height: 400px;
    width:100%;
}
</style>

<template>
<div class="content">
    <div style="background-color:white;margin:10px;padding:5px;">
        <el-form ref="form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="开始时间：">
                        <el-date-picker v-model="formData.fromDate" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="结束时间：">
                        <el-date-picker v-model="formData.endDate" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="6">
                    <el-form-item label="操作：">
                        <el-select v-model="formData.opt" multiple collapse-tags placeholder="请选择">
                            <el-option
                                v-for="item in optList"
                                :key="item"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>

                    </el-form-item>
                </el-col>



                <el-col :span="6">
                    <el-form-item class="form-item">
                        <el-button type="primary" @click="loadData">搜索</el-button>
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>
    </div>

    <div id="main" ref="main"></div>
</div>
</template>

<script>
// 导入echarts
import echarts from 'echarts'
export default {
    
    data() {
        return {
            // 初始化空对象
            chart: null,
            formData: {
                fromDate:this.getCurDateStr(),
                endDate:this.getCurDateStr(),
                userId:24,
                opt:[],
            },
            
            reg:/-/g,
            optList:[],
            needTitle:true,
        }
    },
    watch: {
    'formData.fromDate':function(val) { 
        if(this.formData.fromDate=="" || this.formData.endDate==""){
            return;
        }       
        if(this.formData.fromDate.replace(this.reg,'')>this.formData.endDate.replace(this.reg,'')){
            this.formData.endDate="";
        }
        this.formData.opt=[];
        this.optList=[];
    },
    'formData.endDate':function(val) {  
        if(this.formData.fromDate=="" || this.formData.endDate==""){
            return;
        }
              
        if(this.formData.fromDate.replace(this.reg,'')>this.formData.endDate.replace(this.reg,'')){
            this.formData.fromDate="";
        }
        this.formData.opt=[];
        this.optList=[];
    },
    '$route' (to, from) {
        if(to.path=="/logControl/accessByProvince"){
           this.formData.userId=this.$route.params.id;
           this.loadData();
        }        
        
    },
},
    methods: {
        
        toCharData: function (data) {
            var xdata = [];
            var ydata = [];
            
            for (var i = 0; i < data.length; i++) {
                xdata.push(data[i].optDesc);
                ydata.push(data[i].accessCount);
               
            }   

            if(this.optList.length==0){
                this.optList=xdata;
            }         
            
           
            var option = {
                tooltip: {
                    show: true
                },
                legend: {
                    data: ['访问量']
                },
                xAxis: [{
                    type: 'category',
                    data: xdata
                }],
                yAxis: [{
                    type: 'value',
                }],
                series: [{
                        "name": "访问量",
                        "type": "bar",
                        "data": ydata
                    } 

                ]
            };

            this.chart.setOption(option);

        },
        loadData() {
            var that = this
            this.chart.showLoading()
            this.$axios({
                method: "post",
                url: "/bigData/analyseAccessCountByUserId",
                data: this.formData
            }).then((res) => {
                that.chart.hideLoading()
                switch (res.data.status) {
                    case 200:
                        that.toCharData(res.data.data);
                        break;
                    default:
                        that.toCharData([]);
                        that.$message.error('加载数据失败!');
                        break;
                }
            })

        }
    },
    // keypoint：执行方法
    // “将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。”
    mounted() { 
        this.formData.userId=this.$route.query.userId;  
        this.optList=[];
        this.formData.opt=[];
        this.$nextTick(function () {
            this.chart = echarts.init(this.$refs.main);
            this.loadData()
        })
    }
}
</script>
