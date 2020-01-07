import * as types from './types'
// 设置showLoading状态
export const setShowLoading = flag => dispatch => {
  dispatch({
    type: types.SET_LOADING_STATUS,
    flag
  })
}
// 设置loading info信息
export const setInfo = message => dispatch => {
  dispatch({
    type: types.SET_INFO,
    message
  })
}
// 设置toast状态
export const setStatus = status => dispatch => {
  dispatch({
    type: types.SET_STATUS,
    status
  })
}