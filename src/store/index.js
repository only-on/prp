import Vue from "vue";
import Vuex from "vuex";
import { getUserMessage } from "@/service/api.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    namespace: "prp",
  },
  mutations: {
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
  },
  actions: {
    getUserInfo({ commit, state }) {
      getUserMessage({ namespace: state.namespace }).then((info) => {
        commit("SET_USERINFO", info.data);
      });
    },
  },
  modules: {},
});
