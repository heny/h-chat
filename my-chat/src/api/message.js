import { getData } from './xhr'

/**
 * @name 获取消息列表
 */
export const getMessageList = () =>
  getData('/msg/list')

/**
 * @name 发送消息
 * @param {Object} data 
 */
export const addMessage = data =>
  getData('/msg/add', data, 'post')

/**
 * @name 清空消息列表
 */
export const clearMessage = () =>
  getData('/msg/clear', null, 'post')

/**
 * @name 上传文件
 * @param {formData} file 
 */
export const uploadFile = file =>
  getData('/msg/upload', file, 'post', 'multipart/form-data')

/**
 * @name 清空文件
 */
export const clearFile = () =>
  getData('/msg/clearFile', null, 'post')

/**
 * @name 删除单条
 * @param {Object} data 
 */
export const delItem = data =>
  getData('/msg/del', data, 'post')
