<!--
 * @Author: your name
 * @Date: 2020-11-12 10:16:34
 * @LastEditTime: 2020-11-13 15:02:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \prp-frontend\src\views\show\page\index.vue
-->
<template>
  <div class="content">
    <el-container>
      <el-header>
        <nav-head></nav-head>
      </el-header>
      <el-main>
        <el-row>
          <router-view></router-view>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import navHead from "@/components/header.vue";

export default {
  components: {
    navHead,
  },
};
</script>
<style lang="less">
.content,
.el-container,
.el-row {
  height: 100%;
}
.el-header {
  padding: 0;
  line-height: 60px;
}
.el-main {
  padding: 0;
  margin-top: 1px;
}
</style>
