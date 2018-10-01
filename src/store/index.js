import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
  fileUploadUrl: "http://fzaisheng.com/wf/attachment/reupload",
  fileDownloadUrl: "http://fzaisheng.com/wf/attachment/download?id=",
  fileDownloadUrls: "http://fzaisheng.com/wf/attachment/downloadByBizName?bizObjId=",
  outputImgByIdUrl: "http://fzaisheng.com/wf/attachment/outputImgById?id=",
  outputImgUrl: "http://fzaisheng.com/wf/attachment/outputImg?bizObjId=",
  account: "",
  activeIndex: "",//头部active
  leftActiveIndex: "",//左侧导航active
  // recycleAddr: "http://192.168.5.230:8090/wf",
  recycleAddr: "http://fzaisheng.com/wf",
  dictionary: {},
};

export default new Vuex.Store({
  "state": state,
  getters: {
    getAccount() {
      state.account = sessionStorage.getItem("account");
    },
    getActiveIndex() {
      state.activeIndex = localStorage.getItem("activeIndex");
    },
    getLeftActiveIndex() {
      state.leftActiveIndex = localStorage.getItem("leftActiveIndex");
    },
  },
  actions: {},
  mutations: {
    saveAccount(state, data) {
      sessionStorage.setItem("account", data);
      state.account = data;
    },
    saveActiveIndex(state, data) {
      localStorage.setItem('activeIndex', data);
      state.activeIndex = data;
    },
    saveLeftActiveIndex(state, data) {
      localStorage.setItem('leftActiveIndex', data);
      state.leftActiveIndex = data;
    }
  }
});


