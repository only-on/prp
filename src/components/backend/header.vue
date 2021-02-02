<template>
  <div class="header-box">
    <el-header>
      <div class="user-box" v-if="$route.name !== 'login'">
        <img src="http://192.168.200.25:81/uploads/default/moren.png" alt="" />
        <span>{{ userInfo.fullname }}</span>
        <span @click="handLogout">退出登录</span>
      </div>
    </el-header>
  </div>
</template>

<script>
import { prpBaseUrl } from "@/config.js";
import { logout } from "@/service/api.js";
import Storage from "@/utils/cross.js";
import { removeToken } from "@/utils/auth.js";
import { mapState } from "vuex";
export default {
  components: {},
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    handLogout() {
      const loading = this.$loading({
        lock: true,
        text: "正在退出...",
        spinner: "el-icon-loading",
      });
      logout()
        .then((res) => {
          if (res.code === 0) {
            //去掉远端token
            Storage.delStorage("token");
            //去掉本地缓存
            removeToken();
            this.$store.commit("SET_USERINFO", {});
            //跳转登录页
            this.$router.replace({ path: "/login" });
          }
        })
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 500);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  height: 80px !important;
  background: #fff;
}
.header-box {
  width: 100%;
  height: 80px;
  .user-box {
    height: 100%;
    display: flex;
    align-items: center;
    float: right;
    cursor: pointer;
    img {
      width: 40px;
      height: 40px;
      background: pink;
      border-radius: 50%;
    }
    span:first-of-type {
      padding: 5px 20px;
      border-right: 2px solid #e6e6e6;
    }
    span:last-of-type {
      padding: 0 20px;
      color: #0997e7;
    }
  }
}
</style>
