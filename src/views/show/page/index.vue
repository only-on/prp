<!--
 * @Author: your name
 * @Date: 2020-11-12 10:16:34
 * @LastEditTime: 2020-11-13 14:57:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \prp-frontend\src\views\show\page\index.vue
-->
<template>
    <div class="main-box">
        <el-col :span="18" :offset="3">            
          <div class="content">
                <div class="content-menu">
                  <el-row class="menu-box">
                    <el-col :span="4">
                      <router-link to="/playshow/teachshow" tag="span" active-class="menuactive">教学平台演示</router-link>
                    </el-col>
                  </el-row>
                </div>
                <div class="content-view">
                  <router-view></router-view>
                </div>
          </div>
      </el-col>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Index"
};
</script>
<style lang="less">
.main-box, .main-box > .el-col{
  height: 100%;
}
.content{
  display: flex;
  flex-direction: column;
}
.content-view{
  flex: 1;
}
.content-menu{
  background: @bodyColor;
  position: sticky;
  position: -webkit-sticky;    // 兼容 -webkit 内核的浏览器
  z-index: 3;
  top: 0px;
}
.menu-box{
  background: #fff;
  height: 54px !important;
  line-height: 54px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  margin: 30px 0;
  padding: 0 30px;
  color: @titleColor;
 
  span{
    cursor: pointer;
    padding-bottom: 13px;
    border-bottom: 4px solid #09D9E7;
  }
  .menuactive{
    color:@titleColor;
  }
}
</style>
