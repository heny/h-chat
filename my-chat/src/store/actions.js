import * as types from './types'
// 设置showLoading/toast状态
export const setShowToast = flag => dispatch => {
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

// 设置压缩图片
export const setCompress = flag => ({
  type: types.SET_COMPREFF_IMG,
  flag
})

// 设置hash
export const setHash = hash => ({
  type: types.SET_HASH,
  hash
})
