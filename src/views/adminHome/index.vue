<template>
  <div class="content">
    <el-container>
      <aside-menu></aside-menu>
      <el-container class="right-box">
        <menu-header></menu-header>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import asideMenu from "@/components/backend/aside_menu.vue";
import menuHeader from "@/components/backend/header.vue";
export default {
  components: {
    asideMenu,
    menuHeader,
  },
  mounted() {
    this.$store.dispatch("getUserInfo");
  },
};
</script>

<style lang="less" scoped>
.content,
.el-container,
.el-row {
  height: 100%;
}
.right-box {
  display: flex;
  flex-direction: column;
}
.right-box > div:last-child {
  flex: 1;
}
</style>
