<template>
  <div>
    <el-container>
      <el-aside width="240px">
        <div class="menu-title">课程预发布平台管理系统</div>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :router="true"
        >
          <el-menu-item index="/course">
            <i class="el-icon-reading"></i>
            <span slot="title">课程管理</span>
          </el-menu-item>
          <el-menu-item index="/update">
            <i class="el-icon-time"></i>
            <span slot="title">更新管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.el-container,
.el-aside {
  height: 100%;
  background: @menuBgColor;
  color: #fff;
}
.menu-title {
  line-height: 80px;
  text-align: center;
  font-size: 18px;
}
.el-menu {
  border-right: none;
  background: @menuBgColor;
  color: #fff;
  i {
    color: #fff;
  }
}
.el-menu-item,
.el-menu-item.is-active {
  color: #fff;
  line-height: 56px;
}
.el-menu-item.is-active,.el-menu-item:focus,
.el-menu-item:hover {
  background: #4b5a74;
}
</style>
