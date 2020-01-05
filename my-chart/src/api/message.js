import {getData} from './xhr'

/**
 * 获取消息列表
 */
export const getMessageList = () =>
getData('/msg/list')

/**
 * 发送消息
 * @param {Object} data 
 */
export const addMessage = data =>
  getData('/msg/add', data, 'post')

/**
 * 清空消息列表
 */
export const clearMessage = () =>
  getData('/msg/del', null, 'post')
  