//导出初始化的axios
import service from "@/utils/request.js";
import { userBaseUrl, prpBaseUrl } from "@/config.js";
//登录
export function login(data) {
  return service({
    url: `${userBaseUrl}/user/login/login`,
    method: "post",
    data,
  });
}
//登出
export function logout(data) {
  return service({
    url: `${userBaseUrl}/user/login/logout`,
    method: "post",
    data,
  });
}
//课程管理
export function getCourseList(params) {
  return service({
    url: `${prpBaseUrl}/course/list`,
    method: "get",
    params,
  });
}
//获取用户信息
export function getUserMessage(params) {
  return service({
    url: `${userBaseUrl}/user/login/logined-user`,
    method: "get",
    params,
  });
}
//获取历史记录列表
export function getHistoryList(params) {
  return service({
    url: `${prpBaseUrl}/course-timeline/list`,
    method: "get",
    params,
  });
}
//新建课程
export function setCourseList(data) {
  return service({
    url: `${prpBaseUrl}/course/info`,
    method: "post",
    data,
    headers: {'content-Type': 'multipart/form-data'}
  });
}
// 编辑课程
export function editCourseList(id, data) {
  return service({
    url: `${prpBaseUrl}/course/info/${id}`,
    method: "put",
    data,
  });
}

// 批量删除课程
export function deleteCourseList(data) {
  return service({
    url: `${prpBaseUrl}/course/info`,
    method: "delete",
    data,
  });
}

// 创建历史记录
export function setHistoryList(data) {
  return service({
    url: `${prpBaseUrl}/course-timeline/info`,
    method: "post",
    data,
  });
}
// 编辑历史记录
export function editHistoryList(id, data) {
  return service({
    url: `${prpBaseUrl}/course-timeline/info/${id}`,
    method: "put",
    data,
  });
}
// 批量删除课程
export function deleteHistoryList(data) {
  return service({
    url: `${prpBaseUrl}/course-timeline/info`,
    method: "delete",
    data,
  });
}
// 课程列表
export const courseList = (params) => {
  return service.get(`${prpBaseUrl}/course/list`, { params: params });
};
// 更新历史列表
export const updateHistoryList = (params) => {
  return service.get(`${prpBaseUrl}/course-timeline/listByDate`, {
    params: params,
  });
};
