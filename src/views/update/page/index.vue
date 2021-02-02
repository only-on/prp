<!--
 * @Author: your name
 * @Date: 2020-11-12 10:16:34
 * @LastEditTime: 2020-11-13 16:30:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \prp-frontend\src\views\update\page\index.vue
-->
<template>
  <div class="content">
        <div class="history-img">
          <div class="img-box"></div>
        </div>
        <div class="history-box">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in listData" :key="index" :timestamp="item.date" placement="top" :color="index === 0? '#4BB618' : ''">
              <el-card>
                <div v-for="(item1,index1) in item.items" :key="index1">
                  <h4 :class="item1.type === 1 ? 'add' : item1.type === 2 ? 'delete': 'update'">{{item1.type === 1 ? '新增' : item1.type === 2 ? '删除': '修正'}}：</h4>
                  <div v-for="(item2,index2) in item1.items" :key="index2">
                    <p>{{index2 + 1}}. {{item2.description}}</p>
                  </div>
                </div>
              </el-card>
              </el-timeline-item>
          </el-timeline>
          <div class="moretip" v-if="noMore">没有更多了~</div>
          <!-- <div class="page-box">
              <el-pagination
                @current-change="handleCurrentChange"
                background
                layout="prev, pager, next, total"
                :current-page="currentPage"
                :page-size="pageSize"
                hide-on-single-page
                :total="total">
              </el-pagination>
          </div> -->
        </div>       
  </div>
</template>
<script>
import { updateHistoryList } from '@/service/api'
export default {
  data () {
    return {
      params:{
        page: 1,
        page_size:15,
        type: 0
      },
      currentPage: 1,
      pageSize: 15,
      total: 0,
      listData: [],
      onOff: false,
      totalPage: 0,
      ele: '',
      noMore: false
    };
  },
  methods:{
    handleCurrentChange(page){
      this.currentPage = page;
      this.params.page = page;
      this.getList(this.params);
    },
    handleScroll() {
      // 滚动高度+ 可视区域高度 -文档高度
      const scrollDistance = this.ele.scrollTop + this.ele.clientHeight - this.ele.scrollHeight;
      if (scrollDistance < 0 ) {
        //这个开关是为了避免请求数据中 再次被请求
        if (this.onOff) return;
        this.onOff = true;
        //当前页数小于总页数 就请求
        if (this.currentPage < this.totalPage) {
          this.currentPage += 1;
          this.params.page += 1;
          this.getList(this.params);
        } else {
          this.noMore = true;
        }
      }
    },
     // 节流
    throttle(fn, wait) {
      let context, args;
      let previous = 0;
      return function() {
        let now = +new Date();
        context = this;
        args = arguments; // 取throttle执行作用域的this
        if (now - previous > wait) {
          fn.apply(context, args); // 用apply指向调用throttle的对象，相当于throttle.fn(args);
          previous = now;
        }
      };
    },
    getList (params){
      updateHistoryList(params).then(res => {
        if (res.code === 0) {
          let result = res.data;
          if (result.length !== 0) {
            this.onOff = false;
            let data = this.listData;
            this.listData = this.listData.concat(result.items);
            let arr = [], findata = [];
            if (data.length !== 0) {
              // 上一个请求结果的最后一条的时间是否等于这次请求结果的第一条的时间，是就合并
              if (data[data.length - 1].date === result.items[0].date) {
                // 把相同时间点的合并
                data[data.length - 1].items = data[data.length - 1].items.concat(result.items[0].items);
                for (let i = 0; i < this.listData.length; i++) {
                    if(this.listData[i].date === result.items[0].date) {
                        this.listData[i] = data[data.length - 1];
                        this.listData.splice(i+1,1);
                    }                    
                } 
                // 把合并后里面相同类型的再合并
                for (let j =0; j < data[data.length - 1].items.length; j++) {
                  let item = JSON.parse(JSON.stringify(data[data.length - 1].items[j]));
                  let index = arr.indexOf(item.type);
                  if (index === -1) {
                      arr.push(item.type);
                      findata.push(item);
                  } else {
                    for (let k = 0; k < findata.length; k++) {
                      if (item.type === findata[k].type) {
                        findata[k].items = findata[k].items.concat(item.items);
                      }
                    }
                  }
                }          
                data[data.length - 1].items = JSON.parse(JSON.stringify(findata))
                for (let i = 0; i < this.listData.length; i++) {
                    if(this.listData[i].date === data[data.length - 1].date) {
                        this.listData[i] = data[data.length - 1];
                    }                    
                }
              }
            }
            this.total = result.total;
            this.currentPage = result.page.index;
            this.pageSize = result.page.size;
            this.totalPage = result.page.count;
          } else {           
            this.noMore = true;
          }
        } else {
          this.listData = [];
          this.total = 0;
          this.currentPage = 1;
        }
      })
    }
  },
  mounted () {
    this.ele = document.querySelector('.history-box');
    this.ele.addEventListener("scroll", this.throttle(this.handleScroll, 1000));
  },
  created () {
    this.getList(this.params);
  }
}
</script>
<style lang="less" scoped>
.content{
  width: 100%;
  height: 100%;
}
.history-img{
  width: 30%;
  height: 100%;
  position: fixed;
  background: #fff;
  overflow: auto;
  .img-box{    
    width: 100%;
    height: 100%;
    background: url('../../../assets/image/pic-history.png') no-repeat 65% 20%;
  }
}
.history-box{
  width: 70%;
  height: 100%;
  overflow: auto;
  position: absolute;
  right: 0;
  padding: 30px 20px 0;
  box-sizing: border-box;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  .el-timeline{
    flex :1;
  }
  h4{
    margin-bottom:12px;
    font-size: 16px;
    font-weight: normal;
  }
  p{
    line-height: 30px;
    margin-bottom: 10px;
  }
  .add{
    color: #4BB618;
  }
  .update{
    color: #FD9E0F;
  }
  .delete{
    color: #B61818;
  }
  .moretip{
    color: @tipTextColor;
    text-align: center;
    margin:  30px 0;
  }
}
</style>
