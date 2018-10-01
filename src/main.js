import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import './assets/css/common.css'
import store from './store/index'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import {dateToStr, getCurDateStr, findConfigItem, loadDictionary} from './util/util.js'

Vue.use(VueQuillEditor);

Vue.config.productionTip = false;
Vue.prototype.findConfigItem = findConfigItem;
Vue.prototype.loadDictionary = loadDictionary;
Vue.use(ElementUI);

// 引入axios
import axios from 'axios'

Vue.prototype.getCurDateStr = getCurDateStr;
Vue.prototype.dateToStr = dateToStr;


//axios.defaults.baseURL = 'http://127.0.0.1:8090/mgr';
//axios.defaults.baseURL = 'http://192.168.5.230/mgr';
// axios.defaults.baseURL = 'http://192.168.5.140:8080/mgr';
axios.defaults.baseURL = 'http://fzaisheng.com/mgr';
//axios.defaults.baseURL = 'http://127.0.0.1/mgr';

axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  created() {
    let _this = this;
    _this.loadDictionary("hsly,hszl");
  },
}).$mount('#app');
