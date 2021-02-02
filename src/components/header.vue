<!--
 * @Author: your name
 * @Date: 2020-11-12 10:16:34
 * @LastEditTime: 2020-11-13 09:35:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \prp-frontend\src\components\header.vue
-->
<template>
  <div class="nav">
    <el-row>
      <el-col :span="18" :offset="3">
         西普教育课程预发布平台
        <div class="menu">
          <router-link to="/playshow" tag="span">平台演示</router-link>
          <router-link to="/updateHistory" tag="span">更新历史</router-link>
        </div>
      </el-col>
    </el-row>
   
  </div>
</template>

<script>
export default {
};
</script>

<style lang="less" scoped>
.nav{
  background: @menuBgColor;
  color: #fff;
  font-size: 18px;
}
.menu{
  display: inline-block;
  color: #ccc;
  font-size: 16px;
  span{
    margin-right: 30px;
    margin-left: 30px;
    cursor: pointer;
  }
  span:first-child{
    margin-left: 45px;
  }
}
</style>
