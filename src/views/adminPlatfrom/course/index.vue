<template>
    <div class="table-box">
        <div class="operate-box">
            <div>
                <div v-if="multipleSelection.length > 0" class="selctActive">
                    已选择 <span>{{ multipleSelection.length }}</span> 门课程
                </div>
            </div>

            <div>
                <el-button
                        type="success"
                        class="btn-sm add-btn"
                        @click.native="addCourse"
                >新建课程
                </el-button
                >
                <el-button type="warning" class="btn-sm del-btn" @click="deleteChoose"
                >删除选中
                </el-button
                >
            </div>
        </div>
        <el-table
                ref="multipleTable"
                v-loading="loading"
                :data="courseList"
                tooltip-effect="dark"
                style="width: 100%"
                height="calc(100% - 76px - 52px)"
                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="课程名称"></el-table-column>
            <el-table-column prop="url" label="地址"></el-table-column>
            <el-table-column prop="user" label="关联学生" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" align="center">
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
        <!-- 新建课程 -->
        <el-dialog
                title="新建课程"
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
                    <span class="name">*</span>
                    <el-form-item label="课程名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <span class="impInfo">*</span>
                    <el-form-item label="课程地址" prop="url">
                        <el-input v-model="formData.url" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <span class="impInfo">*</span>
                        <el-form-item label="关联学生账号" prop="user">
                            <el-input v-model="formData.user" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <span class="impInfo">*</span>
                        <el-form-item label="关联学生密码" prop="password">
                            <el-input
                                    v-model="formData.password"
                                    placeholder="请输入"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <span class="impInfo">*</span>
                        <el-form-item label="课程封面" prop="requireImage">
                            <el-upload
                                    :file-list="uploadFiles"
                                    class="avatar-uploader"
                                    ref="uploader"
                                    :action="UploadUrl"
                                    :show-file-list="false"
                                    :auto-upload="false"
                                    :on-change="handleFileChange"
                                    :http-request="this.doUpload"
                                    name="cover"
                            >
                                <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                                <div v-else>上传封面</div>
                                <!--<i
                                  v-else
                                  class="el-icon-plus avatar-uploader-icon"
                                ></i>-->
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center">
                <el-button @click="sansle" :disabled="addClassLoading">取 消</el-button>
                <el-button
                        type="primary"
                        @click="confirm('formData')"
                        :disabled="addClassLoading"
                >确 定
                </el-button
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
    getCourseList,
    setCourseList,
    editCourseList,
    deleteCourseList,
  } from "@/service/api.js";
  import axios from "axios";
  import Storage from "@/utils/cross.js";
  import {setToken} from "@/utils/auth.js";
  import md5 from "md5";

  export default {
    data() {
      return {
        UploadUrl: "",
        loading: false,
        addClassLoading: false,
        imageUrl: "",
        dialogFormVisible: false,
        uploadFiles: [],
        isSelect: false,
        imgIsChange: false,
        multipleSelection: [],
        courseList: [],
        chooseClassArr: [], // 当前选中课程
        rules: {
          name: [
            {
              required: true,
              message: "请输入课程名称",
            },
          ],
          requireImage: [
            {
              validator: (rule, value, callback) => {
                if (!value && !this.formData.id) {
                  callback(new Error('请上传图片'))
                } else {
                  callback()
                }
              }
            }
          ],
          url: [
            {
              required: true,
              message: "请输入课程地址",
            },
          ],
          user: [
            {
              required: true,
              message: "请输入关联学生账号",
            },
          ],
          password: [
            {
              required: true,
              message: "请输入关联学生密码",
            },
          ],
        },
        totals: 0,
        pageOption: {
          page: 1,
          page_size: 5,
        },
        formData: {
          file: "",
          name: "",
          url: "",
          user: "",
          password: "",
          requireImage: "",
        },
      };
    },
    mounted() {
      this.addCourseList();
    },
    methods: {
      handleCurrentChange(page) {
        this.pageOption.page = page;
        this.addCourseList();
      },
      handleSelectionChange(choose) {
        this.multipleSelection = choose;
        this.isSelect = true;
        this.chooseClassArr = choose;
      },
      // 课程编辑按钮
      updateRow(msg) {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.formData.name = msg.name;
          this.formData.file = msg.file;
          this.formData.url = msg.url;
          this.formData.user = msg.user;
          this.formData.password = msg.password;
          this.formData.id = msg.id;
        });
      },
      // 新建课程
      addCourse() {
        this.dialogFormVisible = true;
      },
      beforeUpload(file) {
        const isJPG =
          file.type === "image/jpeg" || "image/jpg" || "imag/png" || "imag/gif";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error("上传头像只能是图片格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 2MB!");
        }
        return isJPG && isLt2M;
      },
      //获取课程列表
      addCourseList(reset = false) {
        if (reset) {
          this.pageOption.page = 1;
        }
        this.loading = true;
        getCourseList(this.pageOption)
          .then((data) => {
            this.courseList = data.data.items;
            this.totals = Number(data.data.total);
          })
          .finally(() => {
            setTimeout(() => {
              this.loading = false;
            }, 500);
          });
      },
      handleFileDelete() {
        this.formData.file = "";
      },
      // 上传图片与后台对接

      /* oldUpload(par) {
        let formDatas = new FormData();
        console.log(par.file);
      }, */

      // 监听文件变化
      handleFileChange(file, fileList) {
        //上传
        if (this.uploadFiles) {
          for (let i = 0; i < this.uploadFiles.length; i++) {
            let file = this.uploadFiles[0];
            if (!file) continue;
            let reader = new FileReader();
            reader.onload = async (e) => {
              try {
                let document = JSON.parse(e.target.result);
                console.log(document);
              } catch (err) {
                console.log(`load JSON document from file error: ${err.message}`);
              }
            };
            reader.readAsText(file.raw);
            this.formData.file = URL.createObjectURL(file.raw);
          }
        }
        this.imgIsChange = true;

        //this.formData.file = URL.createObjectURL(files.raw);
        //this.imageUrl = URL.createObjectURL(file.raw);
        this.uploadFiles = fileList;
        this.formData.requireImage = true;
        this.$refs.formData.validateField("requireImage");
      },

      //新建课程
      confirm(formName) {
        console.log('formName')
        this.$refs[formName].validate((v) => {
          console.log('v', v);
          if (v) {
            this.handleFileChange();
            this.$refs.uploader.submit();
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
          deleteCourseList({ids}).then((res) => {
            this.$message.success("删除成功");
            this.addCourseList(true);
          });
        } else {
          this.$message.info("请选择要删除的课程");
        }
      },
      doUpload(params) {
        console.log(params);
        console.log(this);

        this.addClassLoading = true;
        this.UploadUrl = "http://192.168.200.25/api/course/info";
        let fd = new FormData();
        if (this.formData.id) {
          fd.append('id', this.formData.id)
        }
        if (this.imgIsChange) {
          fd.append('file', params.file)
        }
        fd.append('name', this.formData.name)
        fd.append('url', this.formData.url)
        fd.append('user', this.formData.user)
        fd.append('password', this.formData.password)

        setCourseList(fd).then((data) => {
          console.log('setCourseList', data)
          this.addCourseList(true);
          this.handleFileChange();
        })
          .finally(() => {
            setTimeout(() => {
              this.resetForm();
              this.dialogFormVisible = false;
              this.addClassLoading = false;
            }, 500);
          });
      }
    },
  };
</script>

<style lang="less" scoped>
    //给table加进度条
    /deep/ .el-table__body-wrapper {
        height: 66vh;
        overflow-y: auto;
    }

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

    /deep/ .el-upload {
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
</style>
