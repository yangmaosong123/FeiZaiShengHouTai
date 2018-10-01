import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import {Message} from 'element-ui';

Vue.use(Router);
//公共模块
import Login from '../components/common/login'
import Main from '../components/common/main'

//用户管理
import UserControl from '../components/userControl/index'
import ExamineControl from '../components/userControl/components/examineControl'
import EnterpriseControl from '../components/userControl/components/enterpriseControl'
import EnterpriseControl2 from '../components/userControl/components/enterpriseControl2'

//资讯管理
import InformationControl from '../components/informationControl/index'
import AnnouncementControl from '../components/informationControl/components/announcementControl'
import HomeInformationManagement from '../components/informationControl/components/homeInformationManagement'
import MarketCenterManagement from '../components/informationControl/components/marketCenterManagement'
import FaqProblem from '../components/informationControl/components/faqProblem'
import SlideShowControl from '../components/informationControl/components/slideShowControl'
import AboutUs from '../components/informationControl/components/aboutUs'
import JoinUs from '../components/informationControl/components/joinUs'
import AdvertisingPositionControl from '../components/informationControl/components/advertisingPositionControl'

//订单管理
import OrderControl from '../components/orderControl/index'
import WasteOrdersControl from '../components/orderControl/components/wasteOrdersControl'
import RecoverableOrderControl from '../components/orderControl/components/recoverableOrderControl'

//交易管理
import DealControl from '../components/dealControl/index'
import PlatformIncome from '../components/dealControl/components/platformIncome'
import PlatformExpend from '../components/dealControl/components/platformExpend'
import PlatformFundsTrusteeship from '../components/dealControl/components/platformFundsTrusteeship'


//日志管理
import LogControl from '../components/logControl/index'
import UsersBrowseLog from '../components/logControl/components/usersBrowseLog'
import ErrorLog from '../components/logControl/components/errorLog'

//系统配置
import SystemConfig from '../components/systemConfig/index'
import Config from '../components/systemConfig/components/config'
import accessByProvince from '../components/bigData/AccessByProvince'
import accessByUser from '../components/bigData/AccessByUser'

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '/',
          component: Login
        },
        {
          name: 'main',
          path: '/main',
          component: Main,
          children: [
            {
              name: "userControl",
              path: '/userControl',
              component: UserControl,//用户管理
              children: [
                {
                  name: "examineControl",
                  path: "/examineControl",
                  meta: {isLogin: true},
                  desc: "审批管理",
                  component: ExamineControl//审批管理,
                },
                {
                  name: "enterpriseControl",
                  path: "/enterpriseControl",
                  meta: {isLogin: true},
                  desc: "企业管理",
                  component: EnterpriseControl//企业管理
                }
              ]
            },
            {
              name: "informationControl",
              path: '/informationControl',
              meta: {isLogin: true},
              desc: "资讯管理",
              component: InformationControl,//资讯管理
              children: [
                {
                  name: "announcementControl",
                  path: "/announcementControl",
                  meta: {isLogin: true},
                  desc: "公告管理",
                  component: AnnouncementControl//公告管理
                },
                {
                  name: "slideShowControl",
                  path: "/slideShowControl",
                  meta: {isLogin: true},
                  desc: "轮播图管理",
                  component: SlideShowControl//轮播图管理
                },
                {
                  name: "homeInformationManagement",
                  path: "/homeInformationManagement",
                  meta: {isLogin: true},
                  desc: "首页信息管理",
                  component: HomeInformationManagement//首页信息管理
                },
                {
                  name: "marketCenterManagement",
                  path: "/marketCenterManagement",
                  meta: {isLogin: true},
                  desc: "行情中心",
                  component: MarketCenterManagement//行情中心
                },
                {
                  name: "faqProblem",
                  path: "/faqProblem",
                  meta: {isLogin: true},
                  desc: "常见问题",
                  component: FaqProblem//常见问题
                },
                {
                  name: "aboutUs",
                  path: "/aboutUs",
                  meta: {isLogin: true},
                  desc: "关于我们",
                  component: AboutUs//关于我们
                },
                {
                  name: "joinUs",
                  path: "/joinUs",
                  meta: {isLogin: true},
                  desc: "加入我们",
                  component: JoinUs//加入我们
                },
                {
                  name: "advertisingPositionControl",
                  path: "/advertisingPositionControl",
                  meta: {isLogin: true},
                  desc: "广告位",
                  component: AdvertisingPositionControl//广告位
                }
              ]
            },
            {
              name: "orderControl",
              path: '/orderControl',
              meta: {isLogin: true},
              desc: "订单管理",
              component: OrderControl,//订单管理
              children: [
                {
                  name: "wasteOrdersControl",
                  path: "/wasteOrdersControl",
                  meta: {isLogin: true},
                  desc: "危废订单管理",
                  component: WasteOrdersControl//危废订单管理
                },
                {
                  name: "recoverableOrderControl",
                  path: "/recoverableOrderControl",
                  meta: {isLogin: true},
                  desc: "可回收订单管理",
                  component: RecoverableOrderControl//可回收订单管理
                }
              ]
            },
            {
              name: "dealControl",
              path: '/dealControl',
              meta: {isLogin: true},
              desc: "交易管理",
              component: DealControl,//交易管理
              children: [
                {
                  name: "platformIncome",
                  path: '/platformIncome',
                  meta: {isLogin: true},
                  desc: "平台收入",
                  component: PlatformIncome,//平台收入
                },
                {
                  name: "platformExpend",
                  path: '/platformExpend',
                  meta: {isLogin: true},
                  desc: "平台支出",
                  component: PlatformExpend,//平台支出
                },
                {
                  name: "platformFundsTrusteeship",
                  path: '/platformFundsTrusteeship',
                  meta: {isLogin: true},
                  desc: "平台资金托管",
                  component: PlatformFundsTrusteeship,//平台资金托管
                },
              ]
            },
            {
              name: "logControl",
              path: '/logControl',
              meta: {isLogin: true},
              desc: "日志管理",
              component: LogControl,//日志管理
              children: [
                {
                  name: "usersBrowseLog",
                  path: "/usersBrowseLog",
                  meta: {isLogin: true},
                  desc: "用户浏览日志",
                  component: EnterpriseControl2//用户浏览日志
                },
                {
                  name: "errorLog",
                  path: "/errorLog",
                  meta: {isLogin: true},
                  desc: "错误日志",
                  component: ErrorLog//错误日志
                },
                {
                  name: "accessByProvince",
                  path: "/accessByProvince",
                  meta: {isLogin: true},
                  desc: "通过省",
                  component: accessByProvince
                },
                {
                  name: "accessByUser",
                  path: "/accessByUser",
                  meta: {isLogin: true},
                  desc: "通过用户",
                  component: accessByUser,
                  props: true
                }
              ]
            },
            {
              name: "systemConfig",
              path: '/systemConfig',
              meta: {isLogin: true},
              desc: "系统设置",
              component: SystemConfig,//系统设置
              children: [
                {
                  name: "config",
                  path: "/config",
                  meta: {isLogin: true},
                  desc: "系统配置",
                  component: Config//系统配置
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.isLogin))
    if (!sessionStorage.getItem("account")) {
      setTimeout(() => {
        next("/");
      }, 800);
    } else next();
  else next()
});
export default router;

