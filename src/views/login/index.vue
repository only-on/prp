·<template>
  <div class="login">
    <Headers></Headers>
    <el-container>
      <el-header>课程预发布平台管理系统</el-header>
      <el-main>
        <el-form :model="ruleForm" ref="ruleform" :rules="rules">
          <el-form-item prop="uname">
            <el-input
              v-model="ruleForm.uname"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="passwd">
            <el-input
              v-model="ruleForm.passwd"
              show-password
              placeholder="请输入密码"
              @keyup.enter.native="submitForm('ruleform')"
            ></el-input>
          </el-form-item>
          <el-form-item class="login_menu">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submitForm('ruleform')"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Headers from "@/components/backend/header.vue";
import Storage from "@/utils/cross.js";
import { login } from "@/service/api.js";
import { setToken } from "@/utils/auth.js";
import md5 from "md5";
export default {
  name: "login",
  components: {
    Headers,
  },
  data() {
    return {
      ruleForm: {
        uname: "",
        passwd: "",
      },
      rules: {
        uname: [
          {
            required: true,
            message: "请输入用户名",
          },
        ],
        passwd: [
          {
            required: true,
            message: "请输入密码",
          },
        ],
      },
      userMessage: {
        id: "",
        account: "",
        fullname: "",
        avatar: "",
        introduction: "",
      },
    };
  },
  mounted() {
    this.initToken();
  },
  methods: {
    initToken() {
      let token = Storage.getStorage("token").then((res) => {
        if (res) {
          //缓存token;
          let data = "Bearer " + res;
          setToken(data);
          // 查询用户信息
          this.$store.dispatch("getUserInfo");
          this.$router.replace({ path: "/course" });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((v) => {
        if (v) {
          const loading = this.$loading({
            lock: true,
            text: "登录中...",
            spinner: "el-icon-loading",
          });
          let subform = JSON.parse(JSON.stringify(this.ruleForm));
          subform.passwd = md5(subform.passwd);
          login(subform)
            .then((data) => {
              // 缓存token
              if (data.data.token !== undefined) {
                let datas = data.data.token;
                let token = "Bearer " + datas;
                setToken(token);
                // 缓存token到hub页
                Storage.addStorage("token", data.data.token);
                this.$store.dispatch("getUserInfo");
                // 跳转至首页
                this.$router.replace({ path: "/course" });
              }
            })
            .finally(() => {
              setTimeout(() => {
                loading.close();
              }, 500);
            });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  float: left;
  overflow: hidden;
}
.el-container {
  width: 400px;
  height: 320px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  text-align: center;
  margin: 14% auto;

  .el-header {
    font-weight: 400;
    font-size: 20px;
    line-height: 83px;
    color: #4d4d4d;
  }
  .el-main {
    padding: 36px;
    overflow: hidden;
  }
}
/deep/.el-input__inner {
  border: none;
  border-radius: 0;
  width: 270px;
  border-bottom: 2px solid #d6d6d6;
}
/deep/ .login_menu {
  margin-top: 55px;
  button {
    width: 100px;
    height: 36px;
    font-size: 14px;
    line-height: 14px;
    color: #808080;
  }
  button:last-child {
    background: #416c94;
    color: #ffffff;
  }
}
/deep/ .el-form-item__error {
  left: 30px;
}
</style>
