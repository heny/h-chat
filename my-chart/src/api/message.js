import {getData} from './xhr'

/**
 * 获取消息列表
 */
export const getMessageList = () =>
getData('/msglist')

/**
 * 发送消息
 * @param {Object} data 
 */
export const addMessage = data =>
  getData('/addmsg', data, 'post')

/**
 * 清空消息列表
 */
export const clearMessage = () =>
  getData('/delmsg', null, 'post')
  