<template>
  <div class="table-box">
    <div class="operate-box">
      <div>
        <div v-if="multipleSelection.length > 0" class="selctActive">
          已选择 <span>{{ multipleSelection.length }}</span> 项数据
        </div>
      </div>

      <div>
        <el-button
          type="success"
          class="btn-sm add-btn"
          @click.native="addCourse"
          >新建信息</el-button
        >
        <el-button type="warning" class="btn-sm del-btn" @click="deleteChoose"
          >删除选中</el-button
        >
      </div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="updateHistoryList"
      tooltip-effect="dark"
      style="width: 100%"
      height="calc(100% - 76px - 52px)"
      @selection-change="handleSelectionChange"
      class="updateHisTorylist"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="类型" width="90">
        <template slot-scope="scope" wiath="10">
          <span :class="getTypeColor(scope.row.type)">{{
            scope.row.type_str
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="内容"> </el-table-column>
      <el-table-column
        prop="created_at"
        label="日期"
        show-overflow-tooltip
        width="110"
      >
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button
            @click="updateRow(scope.row)"
            type="text"
            size="mini"
            width="130"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建列表 -->
    <el-dialog
      title="新建信息"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <el-form
        :model="formData"
        ref="formData"
        :rules="rules"
        hide-required-asterisk
        v-loading="addClassLoading"
      >
        <el-row>
          <span class="impInfo">*</span>
          <el-form-item label="类型" prop="type"
            ><br />
            <el-radio-group v-model="formData.type" size="medium">
              <el-radio :label="1">新增</el-radio>
              <el-radio :label="2">删除</el-radio>
              <el-radio :label="3">修正</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <span class="impInfo">*</span>
          <el-form-item label="内容" prop="description">
            <br />
            <el-input
              type="textarea"
              v-model="formData.description"
              width=""
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="sansle" :disabled="addClassLoading">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmInfo('formData')"
          :disabled="addClassLoading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div class="page-box">
      <el-pagination
        v-if="totals > 0"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next, total"
        :current-page="pageOption.page"
        :page-size="pageOption.page_size"
        :total="totals"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getHistoryList,
  setHistoryList,
  editHistoryList,
  deleteHistoryList,
} from "@/service/api.js";

export default {
  data() {
    return {
      loading: false,
      isSelect: false,
      addClassLoading: false,
      imageUrl: "",
      dialogFormVisible: false,
      multipleSelection: [],
      chooseClassArr: [],
      updateHistoryList: [],
      totals: 0,
      pageOption: {
        page: 1,
        page_size: 10,
      },
      rules: {
        type: [
          {
            required: true,
            message: "请选择要删除的类型",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入内容",
          },
        ],
      },

      formData: {
        type: "",
        description: "",
      },
    };
  },

  mounted() {
    this.addHistoryList();
  },
  methods: {
    updateRow(msg) {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.formData.type = msg.type;
        this.formData.description = msg.description;
      });
    },
    //改变类型文字颜色
    getTypeColor(type) {
      let className = "";
      switch (type) {
        case 1:
          className = "type_green";
          break;
        case 2:
          className = "type_orange";
          break;
        case 3:
          className = "type_red";
          break;
        default:
          break;
      }
      return className;
    },
    //分页
    handleCurrentChange(page) {
      this.pageOption.page = page;
      //选择之后从新查询
      this.addHistoryList();
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.isSelect = true;
      this.chooseClassArr = val;
    },

    // 新建课程
    addCourse() {
      this.dialogFormVisible = true;
    },

    //获取更新历史列表
    addHistoryList() {
      this.loading = true;
      getHistoryList(this.pageOption)
        .then((data) => {
          this.updateHistoryList = data.data.items;
          this.totals = Number(data.data.total);
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      console.log(this.$scope);
    },
    //新建课程
    confirmInfo(formName) {
      this.$refs[formName].validate((v) => {
        if (v) {
          this.addClassLoading = true;
          let subform = {
            type: this.formData.type,
            description: this.formData.description,
          };
          if (this.formData.id) {
            // 编辑课程
            editHistoryList(this.formData.id, subform)
              .then((data) => {
                this.addHistoryList(true);
              })
              .finally(() => {
                setTimeout(() => {
                  this.resetForm();
                  this.dialogFormVisible = false;
                  this.addClassLoading = false;
                }, 500);
              });
          } else {
            // 新增课程
            setHistoryList(subform)
              .then((data) => {
                this.addHistoryList(true);
              })
              .finally(() => {
                setTimeout(() => {
                  this.resetForm();
                  this.dialogFormVisible = false;
                  this.addClassLoading = false;
                }, 500);
              });
          }
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      // 删除id字段
      delete this.formData.id;
      this.$refs["formData"].resetFields();
    },
    sansle() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    // 删除选中
    deleteChoose() {
      if (this.chooseClassArr.length > 0) {
        let ids = this.chooseClassArr.map((item) => item.id).join();
        deleteHistoryList({ ids }).then((res) => {
          this.$message.success("删除成功");
          this.addHistoryList(true);
        });
      } else {
        this.$message.info("请选择要删除的课程");
      }
    },
  },
};
</script>

<style lang="less" scoped>
//给table加进度条
/deep/.el-table__body-wrapper {
  height: 66vh;
  overflow-y: auto;
}
/* .operate-box > div {
  display: none;
} */
.table-box {
  width: calc(100% - 60px);
  height: calc(100% - 80px - 60px);
  box-sizing: border-box;
}
.page-box {
  margin-top: 1.5em;
  .el-pagination {
    margin: 0 35%;
  }
}
table {
  width: 100%;
  tr {
    width: 100%;
    display: table;
    table-layout: fixed;
    th {
      width: 100%;
      display: table-cell;
    }
  }
}
.operate-box {
  padding: 0 20px 16px;
  display: flex;
  justify-content: space-between;
  .selctActive {
    padding: 10px 15px;
    background: #d7f2f3;
    border-radius: 5px;
    span {
      color: #0997e7;
    }
  }
  .add-btn {
    background: #4b9532;
    border-color: #4b9532;
  }
  .del-btn {
    background: #f19a49;
    border-color: #f19a49;
  }
}
.el-table {
  .el-table-column--selection > .cell {
    padding-left: 30px;
  }
  td {
    border-bottom: none !important;
  }
  .el-table__row {
    border: none;
  }
}

/deep/.el-upload {
  width: 200px;
  height: 130px;
  display: block;
  margin-top: 30px;
  border: 1px solid #d6d6d6;
  border-radius: 5px;
  i {
    font-size: 60px;
    line-height: 130px;
  }
}
.type_red {
  color: rgba(182, 24, 24, 1);
}
.type_green {
  color: rgba(75, 182, 24, 1);
}
.type_orange {
  color: rgba(253, 158, 15, 1);
}
</style>
