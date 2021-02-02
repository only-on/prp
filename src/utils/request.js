import axios from "axios";
import { Message, MessageBox } from "element-ui";

import { getToken, removeToken } from "@/utils/auth";
import router from "../router";
import Storage from "@/utils/cross.js";

import store from "../store";
// 创建axios实例
const service = axios.create({
  baseURL: "",
  timeout: 100000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }

    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response) => {
    /**
     * code为401是抛错 可结合自己业务进行修改
     */
    const res = response.data;

    if (res.code === 401) {
      Storage.delStorage("token");
      removeToken();
      store.commit("SET_USERINFO", {});
      router.replace({ path: "/login" });
      return Promise.reject("error");
    } else if (res.code === 0) {
      return response.data;
    } else {
      Message({
        message: res.message,
        type: "error",
        duration: 5 * 1000,
      });
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
export default service;
