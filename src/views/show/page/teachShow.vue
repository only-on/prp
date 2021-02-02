<!--
 * @Author: your name
 * @Date: 2020-11-12 10:16:34
 * @LastEditTime: 2020-11-13 14:43:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \prp-frontend\src\views\show\page\index.vue
-->
<template>
  <div class="content">
    <div class="list-box" v-if="listData.length !== 0">
      <div class="list-item" v-for="(item, index) in listData" :key="index">
        <div class="item">
          <img :src="item.cover" alt="" @click="checkInfo(item, index)" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <span>发布于：{{ item.created_at }}</span>
          </div>
        </div>
        <div class="item-tip" v-show="activeIndex == index && item.isShow">
          <h3>{{ item.name }}</h3>
          <div :title="item.user">账号：{{ item.user }}</div>
          <div :title="item.password">密码：{{ item.password }}</div>
          <div>登录平台后，请进入：</div>
          <div>我的课程->{{ item.name }}</div>
          <el-button
            type="primary"
            class="btn-sm btn-center"
            @click="loginCourse(item.url)"
            >登录</el-button>
        </div>
      </div>
    </div>    
    <div class="noMore" v-else>这里什么都没有~</div>
    <div class="page-box">
      <el-pagination
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next, total"
        :current-page="currentPage"
        :page-size="pageSize"
        hide-on-single-page
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { courseList } from "@/service/api";
// @ is an alias to /src
export default {
  data() {
    return {
      params: {
        page: 1,
        page_size: 12,
      },
      currentPage: 1,
      pageSize: 12,
      total: 0,
      listData: [],
      activeIndex: 0,
    };
  },
  methods: {
    checkInfo(item, index) {
      this.activeIndex = index;
      item.isShow = !item.isShow;
      this.listData.map((items, i) => {
        if (i !== index) {
          items.isShow = false;
        }
      });
    },
    // 登录
    loginCourse(url) {
      window.open(url);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.params.page = page;
      this.getCourseList(this.params);
    },
    // 课程列表
    getCourseList(params) {
      courseList(params).then((res) => {
        if (res.code === 0) {
          let result = res.data;
          result.items.forEach((item) => {
            item.isShow = false;
          });
          this.listData = result.items;
          this.total = result.total;
          this.currentPage = result.page.index - 0;
          this.pageSize = result.page.size;
        } else {
          this.listData = [];
          this.total = 0;
          this.currentPage = 1;
        }
      });
    },
  },
  mounted () {
    this.$nextTick(()=>{
        window.addEventListener('click', e => {
        if (e.target.className.indexOf('-box') !== -1) {
          this.listData[this.activeIndex].isShow = false;
        }
      })
    })
  },
  
  beforeDestroy() {  // 实例销毁之前对点击事件进行解绑
      window.removeEventListener('click',function(){});
  },
  created() {
    this.getCourseList(this.params);
  },
};
</script>
<style lang="less">
.content {
  height: 100%;
  display: flex;
  .noMore{
    position: relative;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    color: @tipTextColor;
    letter-spacing: 2px;
    font-size: 20px;
  }
}
.page-box{
  display: flex;
  justify-content: center;
  .el-pagination{
    display: inline-block;
    margin: 40px auto;
  }
}
.list-box {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -1%;
  align-content: flex-start;
  flex: 1;
  .list-item {
    width: 23%;
    height: 260px;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 2%;
    background: #fff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    position: relative;
    color: @titleColor;
    h3 {
      font-family: Microsoft YaHei;
      font-size: 16px;
    }
    .item {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      img {
        width: 100%;
        height: 160px;
        overflow: hidden;
        background: #ccc;
        cursor: pointer;
        -webkit-user-drag: none;
      }
      .item-info {
        flex: 1;
        padding: 15px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        span {
          color: @tipTextColor;
        }
      }
    }
    .item-tip {
      width: 248px;
      font-size: 14px;
      background: #fff;
      border-radius: 5px;
      position: absolute;
      right: -125px;
      top: 50px;
      z-index: 2;
      padding: 30px 30px 0;
      box-sizing: border-box;
      div {
        margin-bottom: 15px;
      }
      h3 ~ div:nth-of-type(1) {
        margin-top: 25px;        
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      h3 ~ div:nth-of-type(2) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      h3 ~ div:nth-of-type(3),
      h3 ~ div:nth-of-type(4) {
        color: @tipTextColor;
      }
      h3 ~ div:nth-of-type(4) {
        line-height: 22px;
      }
      .btn-center {
        display: block;
        margin: 25px auto;
      }
    }
    .item-tip::before {
      content: "";
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid transparent;
      border-right: 10px solid #fff;
      position: absolute;
      left: -20px;
      top: 30px;
    }
  }
}
</style>
