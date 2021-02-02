/**
 * CrossStorage方法封装
 *
 */
import { CrossStorageClient } from "cross-storage";
import { userBaseUrl } from "@/config.js";

var storage = new CrossStorageClient(`${userBaseUrl}/hub/hub.html`);
/** 添加Storage**/
const addStorage = function(name, value) {
  return storage.onConnect().then(function() {
    return storage.set(name, value);
  });
};
/** 获取Storage**/
const getStorage = function(name) {
  return storage.onConnect().then(function() {
    return storage.get(name);
  });
};
/** 删除Storage**/
const delStorage = function(name) {
  return storage.onConnect().then(function() {
    return storage.del(name);
  });
};
/** 获取Storagekeys**/
const getStorageKeys = function(callback) {
  return storage.onConnect().then(function() {
    return storage.getKeys();
  });
};
/** 清除Storage**/
const clearStorage = function() {
  return storage.onConnect().then(function() {
    return storage.clear();
  });
};

export default {
  addStorage,
  getStorage,
  delStorage,
  getStorageKeys,
  clearStorage,
};
